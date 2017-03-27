var registerModule = angular.module('registerModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
registerModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/register', {
			templateUrl: 'modules/register/partials/form.html',
			controller: 'RegisterController'
		})
		.when('/create-user', {
			templateUrl: 'modules/home/partials/home.html',
			controller: 'HomeController'
		});
}]);

/*
	Displays home page and username
*/
registerModule.controller('RegisterController', ['$scope' ,'$location','$http', '$mdToast', function($scope,$location,$http,$mdToast) {


	$scope.checkMail = function () {
		$http.post('/admin/user-check-info/', {mail:$scope.newUser.mail})
		.success(function(data) {
			scope.newUser.mail = data;
		})
		.error(function() {
			scope.newUser.mail = false;
		});
	}

	$scope.checkPassword = function () {
		return ($scope.newUser.password === $scope.newUser.checkPassword) 
	}


	$scope.submitForm = function (formvalid) {
		$http.post('/user/create-user/', {newUser:$scope.newUser}).
			success(function(data, status, headers, config) {
			$location.path('/');
		});
	}
}]);