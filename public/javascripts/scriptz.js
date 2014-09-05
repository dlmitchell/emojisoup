makeRecipe = function() {
  r = $.map($('.pot .fuck'), function(e){ return ":" + $(e).attr("title") + ":"; }).join("");
  $("#hiddenz").attr('value', r);
}

$(document).on('click', '.emoji', function(e) {
	$(this).clone().appendTo(".pot");
	console.log(this);
});	

$(document).on('click', '.tag_edit', function(e) {
  var params = {emoji: $(this).attr('data-emoji-name'), tag:$(this).attr('data-tag-name')};
  var fuck = $(this);
  $.post('/delete_tag', params, function(data) {
    if (!data.e) {
      fuck.remove();
    }      
  });
}); 

$(document).on('click', '#emoji_add_tag', function(e) {
  var tag = $("#tag_name").val();
  var emj = $(this).attr('data-emoji-name');
  var params = {emoji: emj, tag: tag };

  $.post('/add_tag', params, function(data) {
    console.log(data);
    // console.log("hey");
  });
}); 

$('#my_modal').on('show.bs.modal', function(e) {
   var target = $(e.relatedTarget);
   var currentTarget = $(e.currentTarget);

   var name = target.data('emoji-name');	
   var tags = target.data('emoji-tags');
   currentTarget.find('input[name="name"]').val(name);
   currentTarget.find('input[name="tags"]').val(tags);
});


$('.tag_edit').hover(
    function(e) {
      var colors = ['orange', 'green', 'purple'];
      $(this).addClass(colors[Math.floor(Math.random() * 3)]);
    },
    function(e) {
      $(this).removeClass('orange');
      $(this).removeClass('green');
      $(this).removeClass('purple');            
    });

$( document ).ready(function() {
  
  // adds the url text to the search box
  if (window.location.pathname.indexOf('/tags/') >= 0)
    $('#inputSearch').val(window.location.pathname.replace("/tags/", ""))  

  $('#inputSearch').focus()
});