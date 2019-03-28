 
 const PouchDB = require('pouchdb')
 PouchDB.plugin(require('pouchdb-find'))
 const diapersDB = new PouchDB(`http://${process.env.BASE_COUCHDB||'localhost'}:5984/diapers`);

 const salesDB = new PouchDB(`http://${process.env.BASE_COUCHDB||'localhost'}:5984/sales`);

 diapersDB.info().then(function (info) {
     console.log(process.env.BASE_COUCHDB)
    console.log(info);
  })
  salesDB.info().then(function (info) {
    console.log(info);
  })

 
  diapersDB.createIndex(  {
    index: {
    fields: ['model', 'sizes.[].size','active','description']
  }},function (err, result) {
    if (err) { return console.log(err); }
    // handle result
  });
  salesDB.createIndex({
    index:{
      fields:['model','size']
    }
  },function (err, result) {
    if (err) { return console.log(err); }
    // handle result
  })
module.exports = {
    diapersDB,
    salesDB
}


