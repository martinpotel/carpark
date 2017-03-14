/*
	Notes management module
*/

var noteModule = angular.module('noteModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
noteModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/notes', {
			templateUrl: 'modules/notes/partials/list.html',
			controller: 'NoteListController'
		})
		.when('/add-note', {
			templateUrl: 'modules/notes/partials/form.html',
			controller: 'NoteAddController'
		})
		.when('/note-edit/:id', {
			templateUrl: 'modules/notes/partials/form.html',
			controller: 'NoteEditController'
		});
}]);

/*
	Displays note list
*/
noteModule.controller('NoteListController', ['$scope','$http', function($scope,$http) {
	$http.get('/api/notes').success(function(notes) {
		$scope.notes = notes;
	});

	$scope.archivedNotes = function() {
		alert('//TODO');
	}
}]);

/*
	Add note
*/
noteModule.controller('NoteAddController', ['$scope','$http','$location','$mdToast', function($scope,$http,$location,$mdToast) {
	$scope.note = {};
	$scope.noteAdd = true;

	//Submit note to API through a POST request
	$scope.formSubmit = function(form) {
		if(form.$valid) {
			$http.post('/api/note', $scope.note)
			.success(function(result) {
				$mdToast.show($mdToast.simple()
					.content('Note ajoutée')
					.position('top right')
					.hideDelay(3000));
				$location.path('/notes');
			})
			.error(function(error) {
				$mdToast.show($mdToast.simple()
					.content('Une erreur est survenue')
					.position('top right')
					.hideDelay(3000));
			});
		}
	}
}]);

/*
	Edit note
*/
noteModule.controller('NoteEditController', ['$scope','$http','$location','$mdToast','$routeParams', function($scope,$http,$location,$mdToast,$routeParams) {
	//Get note from api
	$http.get('/api/note/'+$routeParams.id).success(function(note) {
		$scope.note = note;
	});

	$scope.noteEdit = true;

	//Submit note to API through POST request
	$scope.formSubmit = function(form) {
		if(form.$valid) {
			$http.post('/api/note', $scope.note)
			.success(function(result) {
				$mdToast.show($mdToast.simple()
					.content('Note modifiée')
					.position('top right')
					.hideDelay(3000));
				$location.path('/notes');
			})
			.error(function(error) {
				$mdToast.show($mdToast.simple()
					.content('Une erreur est survenue')
					.position('top right')
					.hideDelay(3000));
			});
		}
	}

	//Archive note
	$scope.archiveNote = function() {
		alert('//TODO');
	}
}]);