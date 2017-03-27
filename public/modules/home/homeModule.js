/*
	Home page display
*/

var homeModule = angular.module('homeModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial','vsGoogleAutocomplete', 'ngMap']);

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
homeModule.controller('HomeController', ['$scope','$http', function($scope, $http) {

	$http.get('/user/logged-user/').success(function(data){
		console.log(data);
		$scope.user = data;
	});	
}]);

