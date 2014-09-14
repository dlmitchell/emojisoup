makeRecipe = function() {
  r = $.map($('.pot .fuck'), function(e){ return ":" + $(e).attr("title") + ":"; }).join("");
  $("#hiddenz").attr('value', r);
}

$(document).on('click', '.emoji', function(e) {
});	

var client = new ZeroClipboard( $('[data-emoji-name]') );

client.on( "ready", function( readyEvent ) {
  
  // alert( "ZeroClipboard SWF is ready!" );
  client.on("copy", function(event) { 

    var copyval = event.target.getAttribute("data-clipboard-value");
    console.log(copyval)
    event.clipboardData.setData( "text/plain", copyval);
  });

  client.on( "aftercopy", function( event ) {
    // `this` === `client`
    // `event.target` === the element that was clicked
    // console.log(event)
    // event.target.style.display = "none";
    // console.log("Copied text to clipboard: " + event.data["text/plain"] );
  } );
} );

$(document).on('click', '.tag_edit', function(e) {
  var btn = $(this);
  var emj = btn.attr('data-emoji-name');
  var tag = btn.attr('data-tag-name');

  $.ajax({
      url: '/emojis/' + emj + '/tags/' + tag,
      type: 'DELETE',
      success: function(result) {
        btn.remove()
      }
  });
}); 

$(document).on('click', '#emoji_add_tag', function(e) {
  var tag = $("#tag_name").val();
  var emj = $(this).attr('data-emoji-name');
  var params = {emoji: emj, tag: tag };
  $.post('/emojis/' + emj + '/tags', params, function(data) {});
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