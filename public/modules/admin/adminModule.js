var adminModule = angular.module('adminModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
adminModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/admin', {
		templateUrl: 'modules/admin/partials/index.html',
		controller: 'AdminController'
	});
}]);

adminModule.controller('AdminController', function($scope, $http, $location, $mdToast, $mdDialog) {
		
	$http.get('/user/admin-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			if (data === false) $loaction.path('/');
			else {
				$scope.user = data;
				$http.get('/user/all').success(function(users) {
					$scope.users = users;
				});
			}
		}
	});

	$scope.viewLogsUser = function(user) {
		$http.get('/user/logs/'+user._id).success(function(logs) {
			$scope.logs = logs;
			$mdDialog.show({
				controller: function () { this.parent = $scope; },
				controllerAs: 'ctrl',
				templateUrl: '/public/modules/admin/partials/logs.tmpl.html',
				clickOutsideToClose:true
		    });
		});
	}

	$scope.editUser = function (user) {
		$scope.currentUser = user;
		$mdDialog.show({
			controller: function () { this.parent = $scope; },
			controllerAs: 'ctrl',
			templateUrl: '/public/modules/admin/partials/edit.tmpl.html',
			clickOutsideToClose:true,
		});
	}
});