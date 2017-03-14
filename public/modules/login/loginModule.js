var loginModule = angular.module('loginModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
loginModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'modules/login/partials/form.html',
			controller: 'LoginController'
		});
}]);

/*
	Displays home page and username
*/
loginModule.controller('LoginController', ['$scope', function($scope) {


}]);