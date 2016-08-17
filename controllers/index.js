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

router.get('/admin', function(req, res) {
	if (req.query.q) {
		dao.search(req, req.query.q, function(e, emojis, recipes) {
			renderEmojis(res, 'admin', emojis, recipes)
		});
	}
	else  {
		dao.emojis_all(req, function(e, emojis) {
			renderEmojis(res, 'admin', emojis, []);
		});	
	}	
});

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
