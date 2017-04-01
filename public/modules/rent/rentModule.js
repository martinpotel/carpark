var rentModule = angular.module('rentModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
rentModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/rent', {
		templateUrl: 'modules/rent/partials/step1.html',
		controller: 'RentController'
	});
}]);

rentModule.controller('RentController', function($scope, $http, $location) {
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else $scope.user = data;
	});

	$scope.max = 2;
	$scope.selectedIndex = 0;
	$scope.nextTab = function() {
		var index = ($scope.selectedIndex == $scope.max) ? 0 : $scope.selectedIndex + 1;
		$scope.selectedIndex = index;

	};

	$scope.submit = function () {
		console.log($scope.parking);
		$http.post('/parking/save/', {parking:$scope.parking}).
			success(function(data, status, headers, config) {
			$location.path('/');
		});
	}

		
	$scope.parking = {};

	$scope.parking.address = {
		lib: '',
		name: '',
		place: '',
		components: {
			placeId: '',
			streetNumber: '', 
			street: '',
			city: '',
			state: '',
			countryCode: '',
			country: '',
			postCode: '',
			district: '',
			location: {
				lat: '',
				long: ''
			}
		}
	};

});