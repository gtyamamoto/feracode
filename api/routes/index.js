var express = require('express');
var router = express.Router();
const {diapersDB,salesDB} = require('../bin/database')
const _ = require('lodash');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('test')
  res.send('api server')
});
//diapers ENDPOINT
router.get('/diapers', async function(req, res, next) {
   let {skip,limit,model,size,active,description} = req.query;
   let nextquery = [];
   const query = {
     selector:{
     },
     skip:skip || 0,
     limit: limit || 30
   }
   if(model&&typeof model=='string'){
     query.selector.model = {$regex : "/" + model+"/ig"}
     nextquery.push('model='+model);
   }
   if(size&&typeof size=='string'){
    query.selector.sizes = {$elemMatch:{size}}
    nextquery.push('size='+model);
   }
   if(active!==undefined&&active!==null&&typeof JSON.parse(active) =='boolean'){
      query.active = JSON.parse(active);
      nextquery.push('active='+active);
   }
   if(description&& typeof description=='string'){
    query.description = description;
    nextquery.push('description='+description);
   }
 try {
  var result = await db.find(query)
  const countInfo = await diapersDB.info();
  console.log(result)
  res.send({limit:query.limit,skip:query.skip,total:countInfo.doc_count,next:query.limit + query.skip >= countInfo.doc_count ? null : `http://localhost${process.env.NODE_ENV==='production' ? '' : ':8080'}/api/diapers?limit=${limit}&skip=${limit + query.skip}${nextquery.length ? `&${nextquery.join('&')}` : ''}`,result});
 }catch(error) {
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
    diapersDB.post({model,description,sizes,active:true}).then(function(result) {
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
    var doc = await db.get(req.params.id);
     res.send( await db.put({
      _id: req.params.id,
      _rev: doc._rev,
      ... _.pick(req.body, ['model','description','sizes','acitve']
      )
    }));
  } catch (err) {
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
    res.send(result.rows.map(item=>item.doc));
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
    salesDB.post({model,size,quantity,createdAt:new Date(),updatedAt:new Date()}).then(function(result) {
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
module.exports = router;
