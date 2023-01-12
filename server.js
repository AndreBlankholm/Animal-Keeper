const fs = require("fs");
const path = require("path");
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const { animals } = require("./data/animals.json");

// instantiates the server
const express = require("express");

// When Heroku runs the app, we teell the app to use this port if it has been set and if not, set to 3001
const PORT = process.env.PORT || 3001;
//server to listen for requests
const app = express();

// -MIDDLEWARE- Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data
//parse incoming string or array data/ used in POST and takes the data converts it to key/value pairings
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// telling the server that antime the client navigates to host, the app will use router we set up in apiRoutes. and ./ is the default read if no file is provided
app.use('./api/', apiRoutes);
app.use('./', htmlRoutes);
//so the server knows we ask for the frontend links thats on our html pages aka ('public') its a file path
app.use(express.static("public"));

////////////////////////////////////////////////////////////////////////////
//method to listen for requests -- THIS SHOULD ALWAYS BE LAST
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
