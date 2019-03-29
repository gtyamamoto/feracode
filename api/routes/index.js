var express = require('express');
var router = express.Router();
const {diapersDB,salesDB} = require('../bin/database')
const _ = require('lodash');

//diapers ENDPOINT
router.get('/diapers', async function(req, res, next) {
   let {skip,limit,model,size,active,description} = req.query;
   let nextquery = [];
   let indexes = [];
   const query = {
     selector:{
     },
     skip:Number(skip) || 0,
     limit: Number(limit) || 30
   }
   if(model&&typeof model=='string'){
     query.selector.model = {$regex : "/" + model+"/ig"}
     nextquery.push('model='+model);
     indexes.push('model')
   }
   if(size&&typeof size=='string'){
    query.selector.sizes = {$elemMatch:{size}}
    nextquery.push('size='+model);
    indexes.push('sizes.[].size')
   }
   if(active!==undefined&&active!==null&&(active=='true'||active=='false')&&typeof JSON.parse(active) =='boolean'){
     console.log('ok')
      query.selector.active = JSON.parse(active);
      nextquery.push('active='+active);
      indexes.push('active')
   }
   if(description&& typeof description=='string'){
    query.selector.description = description;
    nextquery.push('description='+description);
    indexes.push('description')
   }
 try {
  
   console.log(query)
  var result = await diapersDB.find(query)
  const countInfo = await diapersDB.info();
  const indexInfo = await diapersDB.getIndexes();
  //FILTER INDEXES FROM DOCUMENT COUNT
  const totalDocs = countInfo.doc_count - indexInfo.indexes.filter(el=>el.ddoc).length;
  res.send({limit:query.limit,skip:query.skip,
    pages:Math.ceil(totalDocs/query.limit),total:totalDocs,next:query.limit + query.skip >= totalDocs ? null : `http://localhost${process.env.NODE_ENV==='production' ? '' : ':8080'}/api/diapers?limit=${limit}&skip=${limit + query.skip}${nextquery.length ? `&${nextquery.join('&')}` : ''}`,results:result.docs});
 }catch(error) {
   console.log(error)
    res.status(400).send(error);
};
});
 //get by id
 router.get("/diapers/:id", function(req, res) {
  if(!req.params.id) {
      return res.status(400).send({"status": "error", "message": "An `id` is required"});
  }
  diapersDB.get(req.params.id).then(function(result) {
      res.send(result);
  }, function(error) {
      res.status(400).send(error);
  });
});
//CREATE diaper
router.post("/diapers", function(req, res) {
   const {model,description,sizes} = req.body;
    if(!model) {
        return res.status(400).send({"status": "error", "message": "A `model` is required"});
    } else if(!description) {
        return res.status(400).send({"status": "error", "message": "A `description` is required"});
    }
    else if(!sizes || !sizes.length) {
      return res.status(400).send({"status": "error", "message": "sizes at least one size is required"});
  }
    diapersDB.put({_id:model,model,description,sizes,active:true}).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});
//UPDATE diaper
router.put("/diapers/:id", async function(req, res) {
  if(!req.params.id) {
      return res.status(400).send({"status": "error", "message": "An `id` is required"});
  }
  try {
    var doc = await diapersDB.get(req.params.id);
    if(!doc){
      res.status(400).send({"status": "error", "message": "no diaper found"});
    }
     res.send( await diapersDB.put({
      _id: req.params.id,
      _rev: doc._rev,
      ... Object.assign(_.pick(req.body, ['model','description','sizes','active'],_.omit(doc,['_id','_rev']))
      )
    }));
  } catch (err) {
    console.log(err)
    res.status(400).send(err);
  }
});
//DELETE diaper
router.delete("/diapers/:id", function(req, res) {
  if(!req.params.id) {
      return res.status(400).send({"status": "error", "message": "An `id` is required"});
  }
  diapersDB.get(req.body.id).then(function(result) {
      return diapersDB.remove(result);
  }).then(function(result) {
      res.send(result);
  }, function(error) {
      res.status(400).send(error);
  });
});



//sales ENDPOINT

//GET ALL sales
router.get('/sales', function(req, res, next) {
  salesDB.allDocs({include_docs: true}).then(function(result) {
    //filtering indexes from result
    res.send(result.rows.map(item=>item.doc).filter(el=>!el.views));
}, function(error) {
    res.status(400).send(error);
});
});

//get by id
router.get("/sales/:id", function(req, res) {
  if(!req.params.id) {
      return res.status(400).send({"status": "error", "message": "An `id` is required"});
  }
  salesDB.get(req.params.id).then(function(result) {
      res.send(result);
  }, function(error) {
      res.status(400).send(error);
  });
});
//CREATE sale
router.post("/sales", function(req, res) {
   const {model,size,quantity} = req.body;
    if(!model) {
        return res.status(400).send({"status": "error", "message": "A `model` is required"});
    } else if(!size) {
        return res.status(400).send({"status": "error", "message": "A `size` is required"});
    }
    else if(!quantity) {
      return res.status(400).send({"status": "error", "message": "quantity is required"});
  }
    salesDB.post({model,size,quantity,createdAt:(new Date()).getTime(),updatedAt:(new Date()).getTime()}).then(function(result) {
        res.send(result);
    }, function(error) {
        res.status(400).send(error);
    });
});
//UPDATE sale
router.put("/sales/:id", async function(req, res) {
  if(!req.params.id) {
      return res.status(400).send({"status": "error", "message": "An `id` is required"});
  }
  try {
    var doc = await db.get(req.params.id);
     res.send( await db.put({
      _id: req.params.id,
      _rev: doc._rev,
      ... _.pick(req.body, ['model','size','quantity','updatedAt']
      )
    }));
  } catch (err) {
    res.status(400).send(err);
  }
});
//DELETE sale
router.delete("/sales/:id", function(req, res) {
  if(!req.params.id) {
      return res.status(400).send({"status": "error", "message": "An `id` is required"});
  }
  salesDB.get(req.body.id).then(function(result) {
      return salesDB.remove(result);
  }).then(function(result) {
      res.send(result);
  }, function(error) {
      res.status(400).send(error);
  });
});


//REPORTS -- diapers endsales

router.get("/reports/diaper_stock",async function(req,res){
  const {model,size} = req.query;
  if(!model||!size){
    return res.status(400).send({status:"error",message:"An `model` and `size` are required"});
  }
  //create or check for index to our query
  try {
    const IndexingSales = await salesDB.createIndex({index:{fields:['model','size','createdAt']}});
    
  } catch (error) {
    console.log(error)
  }
  try {
    const IndexingProducts = await diapersDB.createIndex({
      index:{
        fields:['model', 'sizes.[].size']
      }
    });
  } catch (error) {
    console.log(error)
  }

  const getLastTwoSales = await salesDB.find({selector:{model,size,createdAt:{$lte:(new Date()).getTime()}},limit:2,sort:[{createdAt:'desc'}]});
  console.log(getLastTwoSales)
  if(getLastTwoSales.docs.length<2){
    return res.status(400).send({message:'no predicition available'})
  }

  const getStockCount = await diapersDB.find({selector:{model,sizes:{$elemMatch:{size}}},fields:['_id','sizes']})
  console.log(getStockCount)
  const findResult = getStockCount.docs.length ? getStockCount.docs[0].sizes : null;
  if(!findResult){
    return res.status(400).send({message:'no predicition available'})
  }
  const sizeTotal = findResult.find(el=>el.size==size).total
  const timestamp = getLastTwoSales.docs[0].createdAt - getLastTwoSales.docs[1].createdAt;
  res.send({
    prediction:timestamp*sizeTotal/1000
  })
  

  

  
})

module.exports = router;
