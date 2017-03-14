/*
	Home page display
*/

var homeModule = angular.module('homeModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial','vsGoogleAutocomplete']);

/* Routing */
homeModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'modules/home/partials/home.html',
			controller: 'HomeController'
		});
}]);

/*
	Displays home page and username
*/
homeModule.controller('HomeController', ['$scope', function($scope) {
	$scope.userName = 'Jean';
}]);

