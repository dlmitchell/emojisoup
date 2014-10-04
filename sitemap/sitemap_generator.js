#! /usr/bin/env node

console.log("hey")

var mongo = require('mongodb')
var monk = require('monk')
var fs = require('fs');

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'localhost:27017/enodji';

var db = monk(mongoUri);

writeExEmEl = function (name) {
	console.log('<url>');
	console.log('	<loc>' + name + '</loc>');
	console.log('</url>');
}

var filename = 'sitemap.xml';

var sitemap = '\
<?xml version="1.0" encoding="UTF-8"?> \n \
<urlset \n \
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" \n\
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" \n \
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 \n\
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

fs.appendFileSync(filename, sitemap);

var collection = db.get('emojis');
collection.find({}, {}, function(e, docs) {

	for (var i = 0; i < docs.length; i++) {	
		var name = docs[i]["name"];
		var data = ' \
		<url>\n \
			<loc>http://emojisoup.com/emojis/' + name + '</loc> \n \
			<lastmod>2014-09-30T05:14:22Z</lastmod> \n \
			<priority>0.5000</priority> \n \
		</url>\n';
		
		// sitemap += url;	

		fs.appendFileSync(filename, data);	
	}

	fs.appendFileSync(filename, '</urlset>');	

	// sitemap += '</urlset>';



	// fs.writeFile('sitemap.xml', sitemap, function (err) {
	//   if (err) throw err;
	//   console.log('It\'s saved!');
	// });	

	// fs.writeFile('sitemap.xml', sitemap, function(err) {
	// 	if (err)
	// 		console.log("fuck your dick");
	// 	else
	// 		console.log("hi dad");
	// });
	// // console.log(sitemap);

	// process.exit(0)	
});		



