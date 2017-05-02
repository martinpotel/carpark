/*
	Home page display
*/

var homeModule = angular.module('homeModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial','vsGoogleAutocomplete', 'ngMap']);

/* Routing */
homeModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'modules/home/partials/home.html',
			controller: 'HomeController'
		});
}]);

/*
	Displays home page and username
*/
homeModule.controller('HomeController', ['$scope','$http', '$mdDialog', '$location', function($scope, $http,$mdDialog, $location) {

	$scope.notifs = true;

	$http.get('/user/logged-user/').success(function(usr){
		$http.get('/parking/all').success(function(parks) {
			$scope.parkings = parks;
			$scope.user = usr;
			$http.get('/message/not-read/').success(function(message){
				$scope.countMsg = message.count;
				$http.get('/booking/not-confirmed/').success(function(booking){
					$scope.countBooking = booking.count;
				});
					$http.get('/booking/to-confirm/').success(function(resevation){
						$scope.countReservation = resevation.count;
					});
			});	
		});	
	});	

	$scope.displayNotifs = function(notifs) {
		$scope.notifs =notifs;
	}

	$scope.goToMessages = function () {
	   	$location.path('/messages');
	}

	$scope.goToBookings = function () {
	   	$location.path('/bookings');
	}

	$scope.goToReservations = function () {
	   	$location.path('/reservations');
	}

}]);

