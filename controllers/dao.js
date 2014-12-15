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
	// db.get('emojis').find(query, { limit: 25, sort : [['type', 'desc']] }, function(e, emjDocs){
 //        callback(e, emjDocs);
	// });

    db.get('emojis').find(query, { sort : [['type', 'desc']] }, function(e, emjDocs){
        callback(e, emjDocs);
    });
}

DAO.prototype.emojis_all = function(req, callback) {
    var db = req.db;
    var collection = db.get('emojis');

    collection.find({}, { sort : [['type', 'desc']] }, function(e, docs) {
		callback(e, docs);
    });		
}

DAO.prototype.emojis_find_one = function(req, id, callback) {
    var db = req.db;
    var collection = db.get('emojis');

    collection.findOne({_id: id},function(e, emoji){
    	callback(e, emoji);
    });	
}

DAO.prototype.emojis_remove = function(req, emoji, callback) {
    console.log("removing emoji");
    console.log(emoji);

    req.db.get('emojis').remove({_id : emoji}, function(e) {
        console.log(e);
        callback(e);            
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

DAO.prototype.recipes_add = function(req, callback) {

    var payload = req.body;

    try
    {
        var obj = {
            "name" : payload.metadata.name,
            "description" : payload.metadata.description,
            "tags" : payload.metadata.tags.split(','),
            "unicode" : payload.emojis.map(function(e) { return e.unicode }).join(''),
            "emojis_ids" : payload.emojis.map(function(e) { return e._id }),
            "type" : "recipe"
        };

        req.db.get('emojis').insert(obj, function(e, doc) {
            callback(e, doc);
        });
    }   
    catch(e)
    {
        console.log("error occurred");
        console.log(e);
        callback(e, doc);
    } 
    finally
    {

    }
}

exports = module.exports = DAO;