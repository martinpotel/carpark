var profileModule = angular.module('profileModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
profileModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/profile', {
		templateUrl: 'modules/profile/partials/view.html',
		controller: 'ProfileController'
	});
}]);

profileModule.controller('ProfileController', function($scope, $http, $location, $mdToast) {
		
	$scope.edit = { password:false, informations:false};
	$scope.pass = {};


	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
		}
	});

	$scope.saveUser = function () {
		if ($scope.edit.password) {
			$scope.user.password = $scope.pass.password;
			$scope.user.password = $scope.pass.passwordConfirm;
		}
		
		$http.post('/user/update-profile/', {user:$scope.user}).
			success(function(user) {
				$location.path('/');
				$mdToast.show($mdToast.simple()
					.content("Profile edited")
					.position('top right')
					.hideDelay(3000)
				);
				$scope.user = user;
		});
	}
});