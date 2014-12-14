var DAO = function() {}
    
/**
 * @function
 * Searches emojis and recipes
 */
DAO.prototype.search = function(req, searchTerm, callback) {
	console.log(searchTerm)
	var db = req.db;

    var query = {
        $or: 
        [
            {
                name: {
                    $regex: searchTerm, 
                    $options: 'i'
                }
            },
            {
                tags: {
                    $regex: searchTerm, 
                    $options: 'i'
                }
            },
            { 
                unicode: searchTerm 
            } 
        ]    
    }
 
	// search emojis
	db.get('emojis').find(query, {}, function(e, emjDocs){
        callback(e, emjDocs);
	});		
}

DAO.prototype.emojis_all = function(req, callback) {
    var db = req.db;
    var collection = db.get('emojis');

    collection.find({}, {limit:25}, function(e, docs) {
		callback(e, docs);
    });		
}

DAO.prototype.emojis_find_one = function(req, searchTerm, callback) {
    var db = req.db;
    var collection = db.get('emojis');

    collection.findOne({name: searchTerm},function(e, emoji){
    	callback(e, emoji);
    });	
}

DAO.prototype.emojis_add_tag = function(req, emoji, tag, callback) {
    var db = req.db;

    emoji.tags.push(tag);
    db.get('emojis').update(emoji._id, {$set: {tags: emoji.tags}}, function(e) {
        callback(e, emoji);            
    });                
}

DAO.prototype.emojis_delete_tag = function(req, emoji, tag, callback) {
    var db = req.db;    
    var i = emoji.tags.indexOf(tag);

    console.log(emoji.tags)
    console.log(tag)
    if(i != -1)
        emoji.tags.splice(i, 1);

    console.log(emoji.tags);

    db.get('emojis').update(emoji._id, {$set: {tags: emoji.tags}}, function(e) {
        callback(e, emoji);            
    });        
}

DAO.prototype.emojis_edit = function(req, name, tags, callback) {
	var db = req.db;
	var tagsArr = tags.split(',');

    db.get('emojis').findOne({name: name},function(e, emoji){
    	console.log(emoji.tags);
    	console.log(tagsArr);

    	// only edit if there was a difference
    	if (emoji.tags != tagsArr) {
    		emoji.tags = tagsArr;
            
    		db.get('emojis').update(emoji, function(e) {
                console.log(e)
            });
    	}    		

    	callback(emoji);
    });			
}

function set(a, b) {
  return a.concat(b).filter(function(x,i,c) { return c.indexOf(x) == i; });
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

DAO.prototype.recipes_add = function(req, name, description, tags, emjs, callback) {

    var obj = {
        "name" : name,
        "description" : description,
        "tags" : [tags],
        "unicode" : emjs,
        "type" : "recipe"
    };

    req.db.get('emojis').insert(obj, function(e, doc) {
        console.log(e);
        callback(e, doc);
    });
}

exports = module.exports = DAO;