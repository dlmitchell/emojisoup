var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

//---------------------------------
// EMOJIS
//---------------------------------
router.param('emoji', function(req, res, next, name) {
	dao.emojis_find_one(req, name, function(e, emoji) {
		req.emoji=emoji;
		next();
	});		
});


router.route('/:emoji?')
	.get(function(req, res, next) {	
		if (req.params.emoji)
			renderEmojis(res, req.query.edit ? 'emoji_edit' : 'home', [req.emoji], []);
		else 
			dao.emojis_all(req, function(e, emojis) { 
				renderEmojis(res, 'home', emojis, []);
			});
	})
	.post(function(req, res, next) {
		console.log("EMOJIS.POST - posting emoji");
		console.log(req.body);
		
		// renderRecipeAdd(req, res);

		var title = req.body.name;
		var recipe = req.body.recipe;
		var emjs = req.body.emojilist

		// dao.recipes_add(req, title, recipe, emjs, function(e, recipe) {
		// 	res.location("recipe");
		// 	res.redirect("recipe");
		// });
	})
	.put(function(req, res, next) {
		console.log("put");
		renderRecipeAdd(req, res);
	})	

//---------------------------------
// TAGS
//---------------------------------
router.route('/:emoji/tags/:tag?')
	.post(function(req, res, next) {
		var tag = req.body.tag;

		dao.emojis_add_tag(req, req.emoji, tag, function(e, emoji) {
			res.json({e: false})
		});
	})
	.delete(function(req, res, next) {
		if (req.params.tag) {
			console.log("tag: " + req.params.tag)
			dao.emojis_delete_tag(req, req.emoji, req.params.tag, function(e, emoji) {
				if (e == null)
					res.json({e: false});
				else
					res.json({e: true});
			});
		}
	});

module.exports = router;
