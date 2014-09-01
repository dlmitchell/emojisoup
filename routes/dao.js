var DAO = function() {}

/**
 * @function
 * Searches emojis and recipes
 */
DAO.prototype.search = function(req, searchTerm, callback) {
	console.log(searchTerm)
	var db = req.db;
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
	    	callback(e, emjDocs, recDocs);
    	});	
	});		
}

DAO.prototype.emojis_all = function(req, callback) {
    var db = req.db;
    var collection = db.get('emojis');
    collection.find({}, {}, function(e, docs) {
		callback(e, docs);
    });		
}

DAO.prototype.emojis_find_one = function(req, searchTerm, callback) {
    var db = req.db;
    var collection = db.get('emojis');

    collection.findOne({name: searchTerm},function(e, docs){
    	callback(e, docs);
    });	
}

DAO.prototype.tags_all = function(req, callback) {
    var db = req.db;
    var collection = db.get('emojis');
    collection.find({}, {}, function(e, docs) {
		callback(e, docs);
    });			
}

DAO.prototype.all = function(req, callback) {
    var db = req.db;
    db.get('emojis').find({}, {}, function(e, emjDocs) {
    	db.get('recipes').find({}, {}, function(e, recDocs) {
    		callback(e, emjDocs, recDocs);
    	});		
    });
}

DAO.prototype.recipes_find_one = function(req, recipe, callback) {
    req.db.get('recipes').findOne({title: recipe},function(e, recipe){
    	callback(e, recipe);
    });
}

DAO.prototype.recipes_add = function(req, title, recpie, emjs, callback) {
	req.db.get('recipes').insert({
		"title" : title,
		"recipe" : recipe,
		"translation" : "no translation",
		"unicode" : emjs
	}, function(e, doc) {
		callback(e, doc);
	});
}

exports = module.exports = DAO;