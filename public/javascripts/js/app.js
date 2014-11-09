'use strict';

/* App Module */

var enodjiApp = angular.module('enodjiApp', [
    'ngRoute'
  ]);

enodjiApp.controller('EmojiController', function ($scope, $http) {
	
	$scope.searchSuggestions = ['happy', 'food', 'face',  'nature', 'animal', 'fashion', 'cats'];

	// search emojis
	$scope.searchEmojis = function(amount) { 
		$http.get('/api?q=' + amount).success(function(data) {
			$scope.emojis = data.emojis
		});
	};

	// fetch the initial set of emojis
	$http.get('/api/emojis').success(function(data) {
		$scope.emojis = data.emojis
	});

	$scope.getRandomColor = function(){		 
		var colors = 'green';
		// var colors = ['orange', 'green', 'purple'];
		// return colors[Math.floor(Math.random() * 3)];
	}

	// clipboard nonsense. 
	// listen for any changes to the emojis set, and re-apply the clipboard to each result set
	$scope.$watch('emojis', function(newValue, oldValue){

		// creating a new clipboard, otherwise, we get tons of duplicated events	
		// TODO: figure out how to add/remove from new/oldValues from $watch event
		var client = new ZeroClipboard();

		client.on( "ready", function( readyEvent ) {	 
			client.clip($('[data-clipboard-name]'));

			client.on("copy", function(event) {  
				// console.log("copying");		    
				$('.emoji-wrapper-cover').remove();
				event.clipboardData.setData( "text/plain", event.target.getAttribute("data-clipboard-value"));
			});

			// apply the fade out animation that is so sweeetz!
			client.on( "aftercopy", function( event ) {
				// console.log("after copying");

				// add copied text to emoji
				$(event.target.parentNode.parentNode).append("<div class='emoji-wrapper-cover'><h2>COPIED TO CLIPBOARD</h2><p>now go paste somewhere!</p></div>");
				var height = $(event.target.parentNode.parentNode).height();
				$('.emoji-wrapper-cover')
					.height(height + 26)
				  	.css('margin-top', (-1 * height) -26)
				  	.delay(1500).fadeOut();
			});
		});						
	});
});