var parkingModule = angular.module('parkingModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
parkingModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/parkings', {
		templateUrl: 'modules/parking/partials/view.html',
		controller: 'ParkingController'
	});
}]);

parkingModule.controller('ParkingController', function($scope, $http, $location, $mdToast, $mdDialog) {
		
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
			$http.get('/parking/user/'+ $scope.user._id).success(function(parkings){
  				$scope.parkings = parkings;
			});	
		}
	});

	$scope.deletePark = function(ev, p) {
		
		var confirm = $mdDialog.confirm()
			.title('Delete the parking ?')
			.textContent('Are you sure that you want to remove this advert ?')
			.ariaLabel("Confirm")
			.targetEvent(ev)
			.ok('Yes')
			.cancel('No');
		$mdDialog.show(confirm).then(function() {
			$http.get('/parking/delete/'+p._id).
			success(function(data) {
				$mdToast.show(
					$mdToast.simple()
					.content('Parking deleted.')
					.position('top right')
					.hideDelay(3000));
			}).
			error(function(data, status, headers, config) {
				$mdToast.show($mdToast.simple()
					.content('Error')
					.position('top right')
					.hideDelay(3000));
			});
		}, function() {
			$location.path("/parkings");
		});
	}
});