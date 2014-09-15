var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

//---------------------------------
// SEARCH
//---------------------------------

router.get('/', function(req, res) {
	if (req.query.q) {
		dao.search(req, req.query.q, function(e, emojis, recipes) {
			res.json({emojis: emojis, recipes: recipes});
		});
	}
	else  {
		dao.emojis_all(req, function(e, emojis) { 
			res.json({emojis: emojis, recipes: []});
		});
	}	
});


//---------------------------------
// EMOJIS
//---------------------------------
router.route('/emojis/:emoji?')
	.get(function(req, res, next) {	
		if (req.params.emoji) {
			res.json({emojis: [req.emoji], recipes: []});
		}
		else {
			dao.emojis_all(req, function(e, emojis) { 
				res.json({emojis: emojis, recipes: []});
			});
		}
	})

//---------------------------------
// TAGS
//---------------------------------
router.route('/tags/:tag?')
	.get(function(req, res, next) {	
		if (req.params.tag)
			dao.search(req, req.params.tag, function(e, emojis, recipes) {
				res.set({ 'content-type': 'application/json; charset=utf-8' })
				res.json({emojis: emojis, recipes: recipes});
			});
		else 
			dao.tags_all(req, function(e, tags) {
				res.json({tags: tags});
			});			
	})

module.exports = router;