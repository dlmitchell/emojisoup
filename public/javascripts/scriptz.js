
makeRecipe = function() {
  r = $.map($('.pot .fuck'), function(e){ return ":" + $(e).attr("title") + ":"; }).join("");
  $("#hiddenz").attr('value', r);
}

$(document).on('click', '.emoji', function(e) {
	$(this).clone().appendTo(".pot"); // .removeClass('emoji').addClass("fuck");
	// makeRecipe();
	console.log(this);
});	

$('#my_modal').on('show.bs.modal', function(e) {
    // alert("fuck");
    // console.log($(e.relatedTarget))
   // var emj = $(e.relatedTarget).data('emoji-name');    
   // console.log($(e.relatedTarget).data())

   var name = $(e.relatedTarget).data('emoji-name');
	// var name = e.relatedTarget.data('emoji-name')
   $(e.currentTarget).find('input[name="title"]').val(name)
   // $(e.currentTarget).find('input[name="bookId"]').val(bookId);
   // console.log($(e.relatedTarget).find('.data-id'))
});
