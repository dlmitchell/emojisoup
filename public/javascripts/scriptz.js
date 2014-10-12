//------------------------------------------------------
// DOCUMENT READY
//------------------------------------------------------
$( document ).ready(function() {

  renderSavedCookie();

  // adds the url text to the search box
  if (window.location.pathname.indexOf('/tags/') >= 0)
    $('#inputSearch').val(window.location.pathname.replace("/tags/", ""))  

  $('#inputSearch').focus()
});

makeRecipe = function() {
  r = $.map($('#the-pot .fuck'), function(e){ return ":" + $(e).attr("title") + ":"; }).join("");
  $("#hiddenz").attr('value', r);
}

//------------------------------------------------------
// MAKING RECIPES
//------------------------------------------------------
$(document).on('click', '.emoji-blanket > .emoji', function(e) {    
  $('#the-pot .emojis').append($(e.currentTarget.parentNode).clone())  
  $('#copy-recipe').show();
  $('#create-recipe').show();

  var targetUnicode = $(e.currentTarget).attr('data-clipboard-value');
  var currentUnicode = $('#copy-recipe').attr('data-clipboard-value');
  var newValue = currentUnicode + targetUnicode;

  showPot(newValue);
}); 

$(document).on('click', '#the-pot > .emojis > .emoji', function(e) {  
  var targetUnicode = $(e.currentTarget).attr('data-clipboard-value');
  var currentUnicode = $('#copy-recipe').attr('data-clipboard-value');  

  showPot(currentUnicode.replace(targetUnicode, ''));  

  $(e.currentTarget).fadeOut();
}); 

function renderSavedCookie() {
  var text = decodeURI(getCookie("recipe"));

  for (var c = 0; c < text.length; c++)
  {
    var val = text.charAt(c);
    console.log(val);
    var meh = '<span data-clipboard-name="smiley" data-clipboard-value="' + val +'" class="emoji zeroclipboard-is-hover">' + val + ' </span>'
    $('#the-pot .emojis').append(meh);
  }  
}

function showPot(newValue) {
  console.log("in ShowPot");
  console.log(newValue);
  $('#copy-recipe').attr('data-clipboard-value', newValue); 
  $('#hidden-recipe').attr('value', newValue);
  setCookie("recipe", newValue, 1);  
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
    $(event.target.parentNode.parentNode).append("<div class='emoji-wrapper-cover'><h2>COPIED TO CLIPBOARD</h2><p>now go paste somewhere!</p></div>");
    var height = $(event.target.parentNode.parentNode).height();
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
// HELPERS
//------------------------------------------------------

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}


//------------------------------------------------------
// THE MODAL
//------------------------------------------------------

// $('#save-recipe-modal').on('show.bs.modal', function(e) {
//   console.log("fuck");
//   var target = $(e.relatedTarget);
//   console.log(target)
//   // var currentTarget = $(e.currentTarget);

//   // var name = target.data('emoji-name');	
//   // var tags = target.data('emoji-tags');
//   // currentTarget.find('input[name="name"]').val(name);
//   // currentTarget.find('input[name="tags"]').val(tags);
// });


