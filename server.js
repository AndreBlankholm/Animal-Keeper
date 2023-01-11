const fs = require("fs");
const path = require("path");

const { animals } = require("./data/animals.json");

// instantiates the server
const express = require("express");

// When Heroku runs the app, we teell the app to use this port if it has been set and if not, set to 3001
const PORT = process.env.PORT || 3001;
//server to listen for requests
const app = express();

// -MIDDLEWARE- Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.
//parse incoming string or array data/ used in POST and takes the data converts it to key/value pairings
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
//so the server knows we ask for the frontend links thats on our html pages aka ('public') its a file path
app.use(express.static('public'));

////////////////////////////////////////////////////////////////////////////

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note that we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === "string") {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach((trait) => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        // returns an index if true
        (animal) => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  // return the filtered results:
  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter((animal) => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
  const animal = body;
  // adding to the array.json file.
  animalsArray.push(animal);

  // fs and path methods are used here... null means we dont wat to edit any exsiting data and 2 means I want to create white spaces around the data formatted
  fs.writeFileSync(
    path.join(__dirname, "./data/animals.json"),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  return animal;
}

// validation of the Post to add an animal to the array

function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== "string") {
    return false;
  }
  if (!animal.species || typeof animal.species !== "string") {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== "string") {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

//---Back End-----Routing------------------

//request-----get requires 2 arugments/ 1) the string that describes the route, 2)the callback evreytime
app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

app.post("/api/animals", (req, res) => {
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



//----Front End---------Routing---------------------------- 

//create routes to serve index.html  "./" tells where to find the file we want the server to read and send back to client
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, "./public/animals.html"));
});

app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});
// this * acts like a wildcard. Any route thats not prevously define will fall under this request and will recive this (homepage) response
// response should always be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});
////////////////////////////////////////////////////////////////////////////
//method to listen for requests -- THIS SHOULD ALWAYS BE LAST
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
