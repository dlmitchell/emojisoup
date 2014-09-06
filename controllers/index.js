var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

router.get('/', function(req, res) {
	dao.emojis_all(req, function(e, emojis) {
		renderEmojis(res, 'home', emojis, []);
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

// -------------------------
/** RENDERING FUNCTIONS **/
// -------------------------

renderTags = function(res, tags) {
    res.render('tags', {
        emojis : tags,
        recipes : []
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
