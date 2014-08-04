require 'json'
unicode = JSON.parse( IO.read('emojis_unicode.json') )
tags = JSON.parse( IO.read('tags.json') )

# unicode.each { |y| puts y["name"]}

# puts unicode.select { |y| y["name"] == "yellow_heart"}

tags.each do |y|
	p = unicode.select { |x| y["name"] == x["name"] }
	if p.length > 0
		y["unicode"] = p[0]["unicode"]
	end
	# puts p.to_json
end

puts tags.to_json

