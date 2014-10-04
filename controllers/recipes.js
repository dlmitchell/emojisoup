var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

router.param('recipe', function(req, res, next, name) {
	dao.recipes_find_one(req, name, function(e, recipe) {
		req.recipe=recipe;
		next();
	});		
});

router.route('/fucked/new')
	.post(function(req, res, next){
		console.log("post");
	})
	.get(function(req, res, next) {
		console.log("get");
		console.log(req);						
		renderRecipeAdd(req, res);
	})

router.route('/:recipe')
	.get(function(req, res, next) {	
		if (req.params.recipe)
		{
			renderEmojis(res, 'home', [], [req.recipe]);
		}
		else 
		{			
			dao.all(req, function(e, emojis, recipes) {
				renderEmojis(res,'home', [], recipes);
			});	
		}
	})
	.post(function(req, res, next) {
		console.log("post");
		console.log(req.body);
		renderRecipeAdd(req, res);

		// var title = req.body.title;
		// var recipe = req.body.recipe;
		// var emjs = req.body.emojilist

		// dao.recipes_add(req, title, recipe, emjs, function(e, recipe) {
		// 	res.location("recipe");
		// 	res.redirect("recipe");
		// });
	})
	.put(function(req, res, next) {
		console.log("put");
		renderRecipeAdd(req, res);
	})	

module.exports = router;
