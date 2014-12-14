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

module.exports = router;
