var loginModule = angular.module('loginModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
loginModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'modules/login/partials/form.html',
			controller: 'LoginController'
		})
		.when('/login/error/', {
			templateUrl: 'modules/login/partials/form.html',
			controller: 'LoginControllerError'
		});
}]);

/*
	Displays home page and username
*/
loginModule.controller('LoginController', ['$scope', function($scope) {
	$scope.error = false;
}]);

loginModule.controller('LoginControllerError', ['$scope', function($scope) {

	$scope.error = true;

}]);