var express = require('express');
var router = express.Router();
var DAO = require('./dao');
var dao = new DAO();

router.route('/:tag?')
	.get(function(req, res, next) {	
		if (req.params.tag)
		{
			dao.search(req, req.params.tag, function(e, emojis, recipes) {
				renderEmojis(res, 'home', emojis, recipes)
			});
		}
		else 
		{			
			dao.tags_all(req, function(e, tags) {
				renderTags(res, tags);
			});			
		}
	})

module.exports = router;
