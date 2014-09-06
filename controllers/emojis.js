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
		console.log("getting emoji: " + req.params.emoji)
		if (req.params.emoji)
			renderEmojis(res, req.query.edit ? 'emoji_edit' : 'home', [req.emoji], []);
		else 
			dao.emojis_all(req, function(e, emojis) { 
				renderEmojis(res, 'home', emojis, []);
			});
	})

//---------------------------------
// TAGS
//---------------------------------
router.route('/:emoji/tags/:tag?')
	.post(function(req, res, next) {
		var emj = req.body.emoji;
		var tag = req.body.tag;

		console.log(req.body)

		dao.emojis_add_tag(req, emj, tag, function(e, emoji) {		
			res.json({e: false})
		});
	})
	.delete(function(req, res, next) {
		console.log(req.body)

		if (req.params.tag) {
			dao.emojis_delete_tag(req, req.params.emoji, req.params.tag, function(e, emoji) {
				if (e == null)
					res.json({e: false});
				else
					res.json({e: true});		
			});			
		}
	});

module.exports = router;
