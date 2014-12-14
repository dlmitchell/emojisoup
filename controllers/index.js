var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

router.get('/', function(req, res) {
	if (req.query.q) {
		dao.search(req, req.query.q, function(e, emojis, recipes) {
			renderEmojis(res, 'home', emojis, recipes)
		});
	}
	else  {
		dao.emojis_all(req, function(e, emojis) {
			renderEmojis(res, 'home', emojis, []);
		});	
	}	
});

router.route('/recipe')
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

		var name = req.body.name;
		var description = req.body.description;
		var tags = req.body.tags;
		var emjs = req.body.recipe;

		//DAO.prototype.recipes_add = function(req, name, description, tags, emjs, callback) {		

		dao.recipes_add(req, name, description, tags, emjs, function(e, recipe) {
			res.json({recipe: recipe});
		});
	})
	.put(function(req, res, next) {
		console.log("put");
		renderRecipeAdd(req, res);
	})	


// -------------------------
/** RENDERING FUNCTIONS **/
// -------------------------

renderEmojis = function(res, page, emojis, recipes) {	
	res.location(page);	
    res.render(page, {
        emojis : emojis,
        recipes : recipes
    });	
}

renderRecipeAdd = function(req, res) {
	res.render('recipe_add', {
	});
}

renderTags = function(res, tags) {
    res.render('tags', {
        emojis : tags,
        recipes : []
    });	
}

module.exports = router;
