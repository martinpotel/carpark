var registerModule = angular.module('registerModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
registerModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/register', {
			templateUrl: 'modules/register/partials/form.html',
			controller: 'RegisterController'
		});
}]);

/*
	Displays home page and username
*/
registerModule.controller('RegisterController', ['$scope', function($scope) {


}]);