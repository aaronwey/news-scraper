const router = require('express').Router();
const Models = require('../models');
//scrapping tools
const request = require('request');
const cheerio = require('cheerio');

// A GET request to scrape nytimes

module.exports = {
	addComment: (req, res) => {
		const newComment = new Models.Comment(req.body);
		newComment.save(function(error, doc){
			if (error){
				console.log(error);
			}
			else {
				//use article id to find and update it's comment
				Models.Article.findOneAndUpdate({ '_id': req.params.id }, {$push:{ 'comment': doc._id }})
					.exec(function (err, doc) {
						if (err){
							console.log(err);
						}
						else {
							res.redirect('../../saved');
						}
					});
			}
		});
	},

	removeComment: (req, res) => {
		Models.Comment.remove({ '_id': req.params.id }, (error, doc) => res.redirect('../..saved'));
	},
};