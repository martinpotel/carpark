/**
    Copyright POTEL Martin --- CarParking

    Parking controller
*/

var parkingModule = angular.module('parkingModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
parkingModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/parkings', {
		templateUrl: 'modules/parking/partials/view.html',
		controller: 'ParkingController'
	})
	.when('/parking/edit/:id', {
		templateUrl: 'modules/parking/partials/edit.html',
		controller: 'ParkingControllerEdit'
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
				if (typeof data.error !== 'undefined') {
					$mdToast.show(
						$mdToast.simple()
						.content('Parking deleted.')
						.position('top right')
						.hideDelay(3000));
					var index = $scope.parkings.indexOf(p);
	  				$scope.parkings.splice(index, 1);  
	  			}else{
	  				$mdDialog.show(
      					$mdDialog.alert()
					        .clickOutsideToClose(true)
					        .title('Parking can not be removed')
					        .textContent('There is booking(s) for this parking, you can not remove this parking.')
					        .ariaLabel('Impossible remove')
					        .ok('Ok')
					        .targetEvent(ev)
    				);
	  			}
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

	$scope.editPark = function (ev, p) {
		$location.path("/parking/edit/"+p._id);
	}

});

parkingModule.controller('ParkingControllerEdit', function($scope, $http, $location, $mdToast, $mdDialog, $routeParams) {
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			if(typeof $routeParams.id !== 'undefined') {
				$http.get('/parking/get/'+$routeParams.id).success(function(data) {
					$scope.parking = data;
					$scope.parking.dates.start = new Date($scope.parking.dates.start);
					$scope.parking.dates.end = new Date($scope.parking.dates.end);
				});
			}
		}
	});

	$scope.submit = function () {
		console.log($scope.parking);

		$http.post('/parking/save/', {parking:$scope.parking}).
			success(function(data, status, headers, config) {
			$location.path('/parkings');
			$mdToast.show($mdToast.simple()
					.content("Parking Edited")
					.position('top right')
					.hideDelay(3000)
			);
		});
	}

});