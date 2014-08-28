var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'fuck' });
});

/* GET Userlist page */
router.get('/emojis', function(req, res) {
	console.log("find all");
    var db = req.db;
    var collection = db.get('emojis');
    collection.find({},{},function(e,docs){
        res.render('emojis', {
            emojis : docs,
            recipes : []
        });
    });
});

router.get('/emojis/:emoji', function(req, res) {
	var emj = req.params['emoji'];

    var db = req.db;
    var collection = db.get('emojis');

    collection.findOne({name: emj},function(e,docs){
    	console.log(e);
    	console.log(docs);
        res.render('emojis', {
            emojis : [docs],
            recipes : []
        });
    });
});


router.get('/search', function(req, res) {
	var db = req.db;

	var searchTerm = req.query.q;

	var query = {
	  tags: {
	    $regex: searchTerm,
	    $options: 'i' //i: ignore case, m: multiline, etc
	  }
	};

	// search emojis
	var emjColl = db.get('emojis');
	emjColl.find(query, {}, function(e, emjDocs){

		var recQuery = {
		  title: {
		    $regex: searchTerm,
		    $options: 'i' //i: ignore case, m: multiline, etc
		  }
		};

    	var recColl = db.get('recipes');

    	// search recipes
    	recColl.find(recQuery,{},function(e, recDocs){
			res.location("emojis");
			console.log(emjDocs)
	        res.render('emojis', {
	            emojis : emjDocs,
	            recipes : recDocs
	        });
    	});	
	});
});

/** GET new recipe **/
router.get('/recipe', function(req, res) {
    var db = req.db;
    var emjColl = db.get('emojis');

    emjColl.find({},{},function(e,emjDocs){    	
    	var recColl = db.get('recipes');
    	recColl.find({},{},function(e, recDocs){
				res.render('recipe_add', { 
				title: "Add new user",
				emojis : emjDocs,
				recipes : recDocs
			});
    	});		
    });
});

router.get('/recipe/:recipe', function(req, res) {
	var rec = req.params['recipe'];

    var db = req.db;
    var collection = db.get('recipes');

    collection.findOne({title: rec},function(e,docs){
    	console.log(e);
    	console.log(docs);
        res.render('emojis', {
            emojis : [],
            recipes : [docs]
        });
    });
});


/** POST new recipe **/
router.post('/recipe_add', function(req, res) {
	var db = req.db;

	var title = req.body.title;
	var recipe = req.body.recipe;
	var emjs = req.body.emojilist

	var collection = db.get('recipes');
	collection.insert({
		"title" : title,
		"recipe" : recipe,
		"translation" : "no translation",
		"unicode" : emjs
	}, function(err, doc) {
		if (err) {

		}
		else {
			res.location("recipe");
			res.redirect("recipe");
		}
	});
});

// router.post('/add_tag', function(req, res)) {
// 	return {};
// }

module.exports = router;
