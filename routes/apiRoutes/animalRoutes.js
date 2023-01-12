const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');  // every ../ is one level higher so ../../ is 2 levels higher
// grabbing contents of the database
const { animals } = require('../../data/animals.json');

//---Back End-----Routing------------------aka api/

//request-----get requires 2 arugments/ 1) the string that describes the route, 2)the callback evreytime
router.get("/animals", (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
  
  router.get("/animals/:id", (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
  
 router.post("/animals", (req, res) => {
    // want to set an id / set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
  
    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
      res.status(400).send("The animal is not properly formatted.");
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
  });
  

module.exports = router;