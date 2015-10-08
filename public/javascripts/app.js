/// <reference path="../../typings/angularjs/angular.d.ts"/>

'use strict';

var enodjiApp = angular.module('enodjiApp', [
    'ngRoute',
    'ngAnimate',
    'infinite-scroll',
    'ngMaterial'
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

enodjiApp.factory('Scrollgi', function($http) {
  var Scrollgi = function() {
    this.items = [];
    this.busy = false;
    this.after = 0;
    this.query = null;
    this.done = false;
  };

  Scrollgi.prototype.search = function(q) {
  	this.items = [];
  	this.after = 0;
  	this.query = q;  	  	
  	this.nextPage();
  }

  Scrollgi.prototype.nextPage = function() {
    if (this.busy) return;
    this.busy = true;

    var url = "/api/emojis?take=25&skip=" + this.after;
   
    if (this.query)
    	url = url + "&q=" + this.query;

	// console.log(url);	
    $http.get(url).success(function(data) {
    	console.log(data)
    	
		for (var i = 0; i < data.emojis.length; i++) {

			// figure out column span
			var emojiSize = 1;
			if (data.emojis[i].emojis_ids != null && data.emojis[i].emojis_ids != undefined)
				emojiSize = data.emojis[i].emojis_ids.length;

			// let's say 2 emojis = 1 column
			data.emojis[i].cols =   emojiSize % 2 == 0 ? Math.floor(emojiSize / 2) : Math.ceil(emojiSize / 2);
			// console.log(data.emojis[i]);
			this.items.push(data.emojis[i]);
		}

		this.after = this.items.length;
		this.busy = false;

    }.bind(this));
  };

  return Scrollgi;
});


enodjiApp.controller('DialogController', function($scope, $http, $mdDialog, emoji, Scrollgi) {
	$scope.emoji = angular.copy(emoji);
	// $scope.user = angular.copy($scope.emoji);

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};	

	$scope.saveChanges = function(emoji) {
		$scope.spin = true;
		console.log($scope.emoji)
		$http.put('/api/emojis', $scope.emoji).
			success(function(data, status, headers, config) {
				// gotta refresh scrollgis
				$mdDialog.hide();
			}).
			error(function(data, status, headers, config) {
				// $scope.spin = false;
			});	
	}		
});

enodjiApp.controller('EmojiController', function ($scope, $http, $mdDialog, WorkingEmojiService, Scrollgi) {	
	$scope.searchSuggestions = ['😃 People', '👑 Objects', '🌸 Nature', '🚘 Places', '🔼 Symbols'];	
	$scope.secondarySearchSuggestions = ['happy', 'food', 'face',  'nature', 'animal', 'fashion', 'cats'];
	$scope.emojis = WorkingEmojiService.get();	
	$scope.spin = true;
	$scope.showAddForm = false;
	$scope.scrollgis = new Scrollgi();	

	$scope.scrollgis.nextPage();

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

	$scope.showAdvanced = function(emoji, ev) {

		var parentEl = angular.element('.content');
		console.log(parentEl);
		$mdDialog.show({
		  controller: 'DialogController',
		  templateUrl: 'dialog.html',
		  targetEvent: ev,
		  locals: {emoji : emoji},
		  parent: parentEl
		})
		.then(function(answer) {
			console.log("you asasdfsd: " + answer);
			$scope.scrollgis.search('');
		  	$scope.alert = 'You said the information was "' + answer + '".';
		}, function() {
		  $scope.alert = 'You cancelled the dialog.';
		});
	};

	$scope.searchEmojis = function(emojiname) { 
		$scope.scrollgis.search(emojiname);
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
				// console.log(data);
				$scope.spin = false;
			}).
			error(function(data, status, headers, config) {
				$scope.spin = false;
			});			
	}

	// clipboard nonsense. 
	// listen for any changes to the emojis set, and re-apply the clipboard to each result set
	$scope.$watch('scrollgis.items', function(newValue, oldValue){
		
		// creating a new clipboard, otherwise, we get tons of duplicated events
		var client = new ZeroClipboard();

		client.on( "ready", function( readyEvent ) {	 
			client.clip($('[data-clipboard-name]'));

			client.on("copy", function(event) {
				// $('.emoji-wrapper-cover').remove();
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
