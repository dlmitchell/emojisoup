makeRecipe = function() {
  r = $.map($('.pot .fuck'), function(e){ return ":" + $(e).attr("title") + ":"; }).join("");
  $("#hiddenz").attr('value', r);
}

$(document).on('click', '.emoji', function(e) {
	$(this).clone().appendTo(".pot"); // .removeClass('emoji').addClass("fuck");
	// makeRecipe();
	console.log(this);
});	

