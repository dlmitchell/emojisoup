//------------------------------------------------------
// DOCUMENT READY
//------------------------------------------------------
$( document ).ready(function() {
  // adds the url text to the search box
  if (window.location.pathname.indexOf('/tags/') >= 0)
    $('#inputSearch').val(window.location.pathname.replace("/tags/", ""))  

  $('#inputSearch').focus()
});

makeRecipe = function() {
  r = $.map($('.pot .fuck'), function(e){ return ":" + $(e).attr("title") + ":"; }).join("");
  $("#hiddenz").attr('value', r);
}

//------------------------------------------------------
// COPY / PASTE EMOJIS
//------------------------------------------------------
var client = new ZeroClipboard( $('[data-clipboard-name]') );

client.on( "ready", function( readyEvent ) {

  client.on("copy", function(event) { 
    $('.emoji-wrapper-cover').remove();
    event.clipboardData.setData( "text/plain", event.target.getAttribute("data-clipboard-value"));
  });

  client.on( "aftercopy", function( event ) {
    // add copied text to emoji
    $(event.target.parentNode).append("<div class='emoji-wrapper-cover'><h2>COPIED TO CLIPBOARD</h2><p>now go paste somewhere!</p></div>");
    var height = $(event.target.parentNode).height();
    $('.emoji-wrapper-cover')
      .height(height + 26)
      .css('margin-top', (-1 * height) -26)
      .delay(1500).fadeOut();
  });
});

//------------------------------------------------------
// EDIT TAGS
//------------------------------------------------------
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

$('.tag_edit').hover(
  function(e) {
    var colors = ['orange', 'green', 'purple'];
    $(this).addClass(colors[Math.floor(Math.random() * 3)]);
  },
  function(e) {
    $(this)
      .removeClass('orange')
      .removeClass('green')
      .removeClass('purple');            
});

//------------------------------------------------------
// THE MODAL
//------------------------------------------------------

$('#my_modal').on('show.bs.modal', function(e) {
   var target = $(e.relatedTarget);
   var currentTarget = $(e.currentTarget);

   var name = target.data('emoji-name');	
   var tags = target.data('emoji-tags');
   currentTarget.find('input[name="name"]').val(name);
   currentTarget.find('input[name="tags"]').val(tags);
});


