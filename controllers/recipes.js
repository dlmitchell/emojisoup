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

router.route('/:recipe?')
	.get(function(req, res, next) {	
		if (req.params.recipe)
		{
			console.log(req.recipe)
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
		var title = req.body.title;
		var recipe = req.body.recipe;
		var emjs = req.body.emojilist

		dao.recipes_add(req, title, recipe, emjs, function(e, recipe) {
			res.location("recipe");
			res.redirect("recipe");
		});
	})

// -------------------------
/** RENDERING FUNCTIONS **/
// -------------------------

// renderRecipes = function(res, emojis, recipes) {
// 		res.render('recipe_add', { 
// 		title: "Add new recipe",
// 		emojis : emojis,
// 		recipes : recipes
// 	});	
// }

renderEmojis = function(res, page, emojis, recipes) {
	res.location(page);	
    res.render(page, {
        emojis : emojis,
        recipes : recipes
    });	
}

module.exports = router;
