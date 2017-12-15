const router = require('express').Router();
const Models = require('../models');

//scraping tools

const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

// A GET request to scrape nytimes

module.exports = {

	// scrape: (req, res, next) => {
	// 	request({
	// 		url: 'https://www.nytimes.com',
	// 	}, (error, response, html) => {

	// 		// load that into cheerio and save to shorthand selector
	// 		const $ = cheerio.load(html);

	// 		// start the scrapping
	// 		$('div.collection article').each(function(i, element){
	// 			const result = {};
	// 			result.title = $(this)
	// 			  .children('h2 a')
	// 			  .text();
	// 			result.link = $(this)
	// 			  .children('h2 a')
	// 			  .attr('href');
	// 			// result.description = $(this)
	// 			//   .children('p.summary')
	// 			//   .text();

	// 			  //using article model to create and pass result object to entry
	// 			const entry = new Models.Article(result);

	// 			// save entry to db
	// 			entry.save((err, doc) => {
	// 				console.log(err ? err : doc);
	// 			});
	// 		});
	// 	});
	// 	res.redirect('/');
	// },

// 	scrape: function(req, res) {
// 	  axios.get("https://www.nytimes.com/").then(function(response) {
	
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);

//     // Now, we grab every h2 within an article tag, and do the following:
//     $("article h2").each(function(i, element) {
//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//       // Create a new Article using the `result` object built from scraping
//       db.Article
//         .create(result)
//         .then(function(dbArticle) {
//           // If we were able to successfully scrape and save an Article, send a message to the client
//           res.redirect('/');
//           console.log("Scrape Complete");
          
//         })
//         .catch(function(err) {
//           // If an error occurred, send it to the client
//           res.redirect('/');
//           console.log(err);
          
//         });
//     });
//   });
// },

	home: (req, res) => {
		Models.Article.find({}, (error, article) => {
			error ? console.log(error) : res.render('../views/index', {article});
		});
	},

	saveArticle: (req, res) => {
		Models.Article.findOneAndUpdate({'_id': (req.body._id)}, {saved: true},
			(error) => {
				error ? console.log(error) : res.redirect('/');
		});
	},

	unsaveArticle: (req, res) => {
		Models.Article.findOneAndUpdate({'_id': (req.body._id)}, {saved: false},
			(error) => {
				error ? console.log(error) : res.redirect('/');
		});
	},

	viewSaved: (req, res) => {
		Models.Article.find({saved: true}).sort({updatedAt: -1}).populate('comment').exec((error, article) => {
			error ? console.log(error) : res.render('../views/saved', {article})
		});
	},

	clearAll: (req, res) => {
		Models.Article.remove({}, function(err, doc) {
			if (err){
				console.log(err);
			}
			else {
				console.log('removed all articles');
			}
		});
		res.redirect('/');
	}
}
