const articleController = require('../controllers/articleController.js');
const router = require('express').Router();

router.get('/', (req, res) => {
	articleController.home(req, res);
})

// router.get('/scrape', (req, res, next) => {
// 	articleController.scrape(req, res, next);
// });

router.post('/save', (req, res) => {
	articleController.saveArticle(req, res);
});

router.post('/unsave', (req, res) => {
	articleController.unsaveArticle(req, res);
});

router.get('/saved', (req, res) => {
	articleController.viewSaved(req, res);
});

router.get('/clearAll', (req, res) => {
	articleController.clearAll(req, res);
});

module.exports = router;


