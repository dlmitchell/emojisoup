'use strict';

/* App Module */

var enodjiApp = angular.module('enodjiApp', [
    'ngRoute',
    'ngAnimate'
  ]);

enodjiApp.run(function($rootScope) {
	$rootScope.isChrome = !!window.chrome;

	$rootScope.hasChromoji = function() {
		// TODO: look to determine if user has chromoji or similar extensions installed
	};
});

enodjiApp.service("WorkingEmojiService", function() {
	var emojis = [];

	return {
		add: function(emoji) {
			emojis.push(emoji);	
		},

		clear: function() {
			emojis = [];
		},

		get: function() {
			return emojis;
		}
	};
});

enodjiApp.controller('PotController', function ($scope, $http, WorkingEmojiService) {		
	$scope.pot = "hello pot"
	$scope.emojis = WorkingEmojiService.get();

	$scope.clearPot = function() {	
		$("#copy-recipe").attr("data-clipboard-value", "");
		WorkingEmojiService.clear();		
	}

	$scope.copyRecipe = function($event) {
		// $(event.target.parentNode.parentNode).append("<div class='emoji-wrapper-cover'><h2>COPIED TO CLIPBOARD</h2><p>now go paste somewhere!</p></div>");

		// var height = $(event.target.parentNode.parentNode).height();

		// $('.emoji-wrapper-cover')
		// 	.height(height + 26)
		//   	.css('margin-top', (-1 * height) -26)
		//   	.delay(1500).fadeOut();	
	}

	$scope.$watch(WorkingEmojiService.get,function(v){
		$scope.emojis = v;	
	});
});

enodjiApp.controller('EmojiController', function ($scope, $http, WorkingEmojiService) {	
	$scope.searchSuggestions = ['People', 'Nature', 'Objects',  'Places', 'Symbols'];	
	$scope.secondarySearchSuggestions = ['happy', 'food', 'face',  'nature', 'animal', 'fashion', 'cats'];

	// search emojis
	$scope.searchEmojis = function(emojiname) { 
		$http.get('/api?q=' + emojiname).success(function(data) {
			$scope.emojis = data.emojis
		});
	};

	// fetch the initial set of emojis
	$http.get('/api/emojis').success(function(data) {
		$scope.emojis = data.emojis
	});

	$scope.getRandomColor = function(){
		//one day this will do something
	}

	$scope.addToPot = function(emoji, $event) {
		WorkingEmojiService.add(emoji);

		// apply the fade out animation that is so sweeetz!
		$(event.target.parentNode.parentNode).append("<div class='emoji-wrapper-cover'><h2>COPIED TO CLIPBOARD</h2><p>now go paste somewhere!</p></div>");
		var height = $(event.target.parentNode.parentNode).height();
		$('.emoji-wrapper-cover')
			.height(height + 26)
		  	.css('margin-top', (-1 * height) -26)
		  	.delay(1500).fadeOut();		
	}

	// clipboard nonsense. 
	// listen for any changes to the emojis set, and re-apply the clipboard to each result set
	$scope.$watch('emojis', function(newValue, oldValue){		

		// creating a new clipboard, otherwise, we get tons of duplicated events
		var client = new ZeroClipboard();

		client.on( "ready", function( readyEvent ) {	 
			client.clip($('[data-clipboard-name]'));

			client.on("copy", function(event) {  
				$('.emoji-wrapper-cover').remove();
				event.clipboardData.setData( "text/plain", event.target.getAttribute("data-clipboard-value"));
			});

			client.on( "aftercopy", function( event ) {
				var targetName = $(event.target).attr('data-clipboard-name');			
			});
		});						
	});
});