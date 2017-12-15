// dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const axios = require('axios');
const cheerio = require('cheerio');
var db = require("./models");
// mogan for logging requests and body-parser for handling form submissions

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

//make public a static dir

app.use(express.static('public'));

//initialize handlebars

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

for (let route in routes) {
  app.use(route, routes[route]);
}

// set mongoose to leverage built it in ES6 promises

mongoose.Promise = Promise;

// database config with mongoose + mongoose errors and connect

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/nytimesHW');

const db1 = mongoose.connection;

db1.on('error', (error) => {
	console.log('Mongoose error:', error);
});

db1.once('open', () => {
	console.log('Mongoose connected');
});

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          // If we were able to successfully scrape and save an Article, send a message to the client
          res.redirect('/');
          console.log("Scrape Complete");
          
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.redirect('/');
          console.log(err);
          
        });
    });
  });
});

// set port

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App is listening on port ${port}!`);
});