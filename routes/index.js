var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

router.get('/', function(req, res) {
	dao.emojis_all(req, function(e, emojis) {
		renderEmojis(res, 'home', emojis, []);
	});	
});

router.post('/emojis', function(req, res) {
	var name = req.body.name;
	var tags = req.body.tags;

	dao.emojis_edit(req, name, tags, function(e, emoji) {
		res.redirect("home");
	});
});

router.get('/emojis/:emoji', function(req, res) {
	var emj = req.params['emoji'];
	dao.emojis_find_one(req, emj, function(e, emojis) {
		renderEmojis(res, 'home', [emojis], []);
	});
});

router.get('/emojis/:emoji/edit', function(req, res) {
	var emj = req.params['emoji'];
	dao.emojis_find_one(req, emj, function(e, emojis) {
		renderEmojis(res, 'emoji_edit', [emojis], []);
	});
});

router.post('/add_tag', function(req, res) {
	var emj = req.body.emoji;
	var tag = req.body.tag;

	console.log(req.body)

	dao.emojis_add_tag(req, emj, tag, function(e, emoji) {		
		res.json({e: false})
	});
});

router.post('/delete_tag', function(req, res) {
	var emj = req.body.emoji;
	var tag = req.body.tag;

	dao.emojis_delete_tag(req, emj, tag, function(e, emoji) {
		if (e == null)
			res.json({e: false});
		else
			res.json({e: true});		
	});
});

router.get('/tags', function(req, res) {
	var searchTerm = req.query.q;
	if (searchTerm) {
		dao.search(req, searchTerm, function(e, emojis, recipes) {
			renderEmojis(res, 'home', emojis, recipes)
		});
	}
	else  {
		dao.tags_all(req, function(e, tags) {
			renderTags(res, tags);
		});			
	}
});

router.get('/tags/:tagname', function(req, res) {	
	dao.search(req, req.params['tagname'], function(e, emojis, recipes) {
		renderEmojis(res, 'home', emojis, recipes)
	});
});

/** GET new recipe **/
router.get('/recipes', function(req, res) {
	dao.all(req, function(e, emojis, recipes) {
		renderRecipes(res, [], recipes);
	});
});

router.get('/recipes/:recipe', function(req, res) {
	dao.recipes_find_one(req, req.params['recipe'], function(e, recipe) {
		renderEmojis(res, 'home', [], [recipe]);
	});
});

/** POST new recipe **/
router.post('/recipe_add', function(req, res) {
	var title = req.body.title;
	var recipe = req.body.recipe;
	var emjs = req.body.emojilist

	dao.recipes_add(req, title, recipe, emjs, function(e, recipe) {
		res.location("recipe");
		res.redirect("recipe");
	});
});

// -------------------------
/** RENDERING FUNCTIONS **/
// -------------------------

renderTags = function(res, tags) {
    res.render('tags', {
        emojis : tags,
        recipes : []
    });	
}

renderRecipes = function(res, emojis, recipes) {
		res.render('recipe_add', { 
		title: "Add new recipe",
		emojis : emojis,
		recipes : recipes
	});	
}

renderEmojis = function(res, page, emojis, recipes) {
	res.location(page);	
    res.render(page, {
        emojis : emojis,
        recipes : recipes
    });	
}

module.exports = router;
