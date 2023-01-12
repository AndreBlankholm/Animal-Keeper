const path = require('path');
const router = require('express').Router;

const apiRoutes = require('../routes/apiRoutes');
const htmlRoutes = require('../routes/htmlRoutes');
//----Front End---------Routing---------------------------- 

const router = require("../apiRoutes/animalRoutes");

//create routes to serve index.html  "./" tells where to find the file we want the server to read and send back to client
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
  
 router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/animals.html"));
  });
  
  router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });
  // this * acts like a wildcard. Any route thats not prevously define will fall under this request and will recive this (homepage) response
  // response should always be last
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });


  module.exports = router;