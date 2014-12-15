var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

//---------------------------------
// SEARCH
//---------------------------------

router.get('/', function(req, res) {

	res.set({ 'content-type': 'application/json; charset=utf-8' });

	if (req.query.q) {
		dao.search(req, req.query.q, function(e, emojis, recipes) {
			res.json({emojis: emojis});
		});
	}
	else  {
		dao.emojis_all(req, function(e, emojis) { 
			res.json({emojis: emojis});
		});
	}	
});


//---------------------------------
// EMOJIS
//---------------------------------
router.route('/emojis/:emoji?')
	.get(function(req, res, next) {	

		res.set({ 'content-type': 'application/json; charset=utf-8' });

		if (req.params.emoji) {		
			console.log("finde one: " + req.params.emoji);
			dao.emojis_find_one(req, req.params.emoji, function(e, emojis) {
				res.json({emojis: [emojis]});
			});			
		}
		else {
			dao.emojis_all(req, function(e, emojis) { 
				console.log("all emojis done");
				res.json({emojis: emojis});
			});
		}
	})
	// create a recipe/emoji
	.post(function(req, res, next) {
		dao.recipes_add(req, function(e, recipe) {
			res.json({recipe: recipe});
		});
	})
	// edit a recipe/emoji combo
	.put(function(req, res, next) {
		console.log("put");
		renderRecipeAdd(req, res);
	})	
	.delete(function(req, res, next) {
		if (req.params.emoji) {		
			console.log("removing: " + req.params.emoji);
			dao.emojis_remove(req, req.params.emoji, function(e, emojis) {
				res.json(null);
			});			
		}
	})


//---------------------------------
// TAGS
//---------------------------------
router.route('/tags/:tag?')
	.get(function(req, res, next) {	
		res.set({ 'content-type': 'application/json; charset=utf-8' });

		if (req.params.tag)
			dao.search(req, req.params.tag, function(e, emojis, recipes) {
				res.json({emojis: emojis, recipes: recipes});
			});
		else 
			dao.tags_all(req, function(e, tags) {
				res.json({tags: tags});
			});			
	})

module.exports = router;
