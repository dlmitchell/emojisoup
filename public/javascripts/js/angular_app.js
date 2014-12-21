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
	var unicodez = "";
	return {
		add: function(emoji) {
			emojis.push(emoji);	
			unicodez += emoji.unicode;
		},

		clear: function() {
			emojis = [];
			unicodez = "";
		},

		get: function() {
			return emojis;
		},

		unicode: function() {
			return unicodez;
		}
	};
});

// Reddit constructor function to encapsulate HTTP and pagination logic
enodjiApp.factory('Scrollgi', function($http) {
  var Scrollgi = function() {
    this.items = [];
    this.busy = false;
    this.after = '';
  };

  Scrollgi.prototype.nextPage = function() {
  	console.log("uasdfsd")
    if (this.busy) return;
    this.busy = true;

    console.log(this);

    var url = "api/emojis/" + this.after + "&jsonp=JSON_CALLBACK";
    $http.jsonp(url).success(function(data) {
      var items = data.data.children;
      for (var i = 0; i < items.length; i++) {
        this.items.push(items[i].data);
      }
      this.after = "t3_" + this.items[this.items.length - 1].id;
      this.busy = false;
    }.bind(this));
  };

  return Scrollgi;
});

enodjiApp.controller('EmojiController', function ($scope, $http, WorkingEmojiService, Scrollgi) {	
	$scope.searchSuggestions = ['People', 'Nature', 'Objects',  'Places', 'Symbols'];	
	$scope.secondarySearchSuggestions = ['happy', 'food', 'face',  'nature', 'animal', 'fashion', 'cats'];
	$scope.emojis = WorkingEmojiService.get();	
	$scope.spin = true;
	$scope.showAddForm = false;
	$scope.scrollgis = new Scrollgi();

	// fetch the initial set of emojis
	$http.get('/api/emojis').success(function(data) {
		$scope.emojis = data.emojis;
		$scope.spin = false;
	});

	// model for debounced search
	var _value;
	$scope.query = {
		value: function(newName) {		  
		  if (angular.isDefined(newName)) {
		    _value = newName;
		    $scope.searchEmojis(newName);
		  }
		  return _value;
		}
	};	

	// search emojis
	$scope.searchEmojis = function(emojiname) { 
		$scope.spin = true;
		$http.get('/api?q=' + emojiname).success(function(data) {
			$scope.emojis = data.emojis
			$scope.spin = false;
		});
	};

	$scope.getEmoji = function(emojiId) { 
		$scope.spin = true;
		$http.get('/api/emojis/' + emojiId).success(function(data) {
			$scope.emojis = data.emojis
			$scope.spin = false;
		});
	};	

	$scope.addToPot = function(emoji, $event) {
		WorkingEmojiService.add(emoji);

		// apply the fade out animation that is so sweeetz!
		$(event.target.parentNode.parentNode).append("<div class='emoji-wrapper-cover'><h2>COPIED TO CLIPBOARD</h2><p>now go paste somewhere!</p></div>");
		var height = $(event.target.parentNode.parentNode).height();
		var width = $(event.target.parentNode.parentNode).width();
		$('.emoji-wrapper-cover')
			.height(height)
			.width(width)
		  	.css('margin-top', (-1 * height))
		  	.delay(1500).fadeOut();
	}

	$scope.clearPot = function() {	
		$("#copy-recipe").attr("data-clipboard-value", "");
		WorkingEmojiService.clear();		
	}

	// model for adding new recipe/sentence
	$scope.addRecipe = function(recipe) {
		var data = {
			metadata: recipe,
			emojis: $scope.sentence
		};

		$scope.spin = true;
		$http.post('/api/emojis', data).
			success(function(data, status, headers, config) {
				$scope.getEmoji(data.recipe._id);
				$scope.recipe = {};
				$scope.spin = false;
			}).
			error(function(data, status, headers, config) {
				$scope.spin = false;
			});	
	}	

	$scope.removeEmoji = function(emoji) {
		$http.delete('/api/emojis/' + emoji).
			success(function(data, status, headers, config) {
				console.log(data);
				$scope.spin = false;
			}).
			error(function(data, status, headers, config) {
				$scope.spin = false;
			});			
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

	$scope.$watch(WorkingEmojiService.get,function(v){
		$scope.sentence = v;	
	});	

	$scope.$watch(WorkingEmojiService.unicode,function(v){
		$scope.unicodez = v;
	});		
});
