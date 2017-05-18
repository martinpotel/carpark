/**
    Copyright POTEL Martin --- CarParking

    Rent(post advert controller)
*/

var rentModule = angular.module('rentModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
rentModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/rent', {
		templateUrl: 'modules/rent/partials/step1.html',
		controller: 'RentController'
	});
}]);

rentModule.controller('RentController', function($scope, $http, $location, $mdToast) {
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else $scope.user = data;
	});

	$scope.submit = function () {
		$http.post('/parking/save/', {parking:$scope.parking}).
			success(function(data, status, headers, config) {
			$location.path('/');
			$mdToast.show($mdToast.simple()
					.content("Advert created")
					.position('top right')
					.hideDelay(3000)
			);
		});
	}

		
	$scope.parking = {};
	$scope.parking.dates = {}
	$scope.parking.dates.always = false;

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