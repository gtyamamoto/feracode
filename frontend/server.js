
//only to serve pre-built react app as a node service to better
//modularization as a node js app


const express = require('express');
  const path = require('path');
  const cors = require('cors');
  
  const app = express();
  app.disable('x-powered-by');
  app.use(cors())
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  app.listen(
    process.env.PORT || 5000,
    function () {
      console.log(`Frontend start on http://localhost:5000`)
    }
  );