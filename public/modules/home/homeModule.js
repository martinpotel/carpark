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


	$scope.map = {};
	$scope.address = {};

	$http.get('/user/logged-user/').success(function(usr){
		$http.get('/parking/all').success(function(parks) {
			$scope.parkings = parks;
			$scope.user = usr;
			$scope.parkSelected = $scope.parkings[0];
			$scope.map.lat = $scope.parkSelected.address.location.lat;
			$scope.map.long = $scope.parkSelected.address.location.long;
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

	$scope.selectPark = function (p) {
		$scope.parkSelected = p;
		$scope.map.lat = $scope.parkSelected.address.location.lat;
		$scope.map.long = $scope.parkSelected.address.location.long;
	}

	$scope.showAlert = function(ev, p) {
		$scope.parkSelected = p;
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'public/modules/home/partials/dialog1.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: $scope.customFullscreen,
			p:p,
		});
	};

	$scope.goToMessages = function () {
	   	$location.path('/messages');
	}

	$scope.goToBookings = function () {
	   	$location.path('/bookings');
	}

	$scope.goToReservations = function () {
	   	$location.path('/reservations');
	}

	function DialogController($scope, $mdDialog,$location,  p) {
	  	$scope.p = p;
	  	$http.get('/parking/owner/'+ $scope.p.user).success(function(owner){
	  		$scope.owner = owner;
	  		$scope.p = p;
		});	


	    $scope.hide   = function()       { $mdDialog.hide();       };
	    $scope.cancel = function()       { $mdDialog.cancel();     };
	    $scope.answer = function(answer) { $mdDialog.hide(answer); };

	    $scope.openMessageBox = function(ev, owner) {
			$http.get('/user/logged-user/').success(function(data){
				if (typeof data === 'undefined' || data === 'undefined') {
					$location.path('/login');
					$mdDialog.hide();
				}
				else 
					$mdDialog.show({
						controller: MessageController,
						templateUrl: 'public/modules/home/partials/message.tmpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true,
						fullscreen: $scope.customFullscreen,
						owner:owner,
						p:$scope.p
					}); 
			});	
	    };

	    $scope.bookParking = function (ev, p, owner) {
	    	$http.get('/user/logged-user/').success(function(data){
				if (typeof data === 'undefined' || data === 'undefined') {
					$location.path('/login');
					$mdDialog.hide();
				}
				else 
			    	$mdDialog.show({
						controller: BookingController,
						templateUrl: 'public/modules/home/partials/booking.tmpl.html',
						parent: angular.element(document.body),
						targetEvent: ev,
						clickOutsideToClose:true,
						fullscreen: $scope.customFullscreen,
						owner:owner,
						p:p,
						owner:owner
				});
			}); 
	    }

	}

	function MessageController($scope, $mdDialog, $mdToast, owner, p) {
		$scope.owner = owner;
		$scope.p = p;

		$scope.message = {to:$scope.owner._id, parking:p._id};

		$scope.sendMessage = function () {
			$http.post('/message/send/', {message:$scope.message}).
			success(function(data, status, headers, config) {
				$mdDialog.hide();
				$mdToast.show($mdToast.simple()
					.content("Message sent")
					.position('top right')
					.hideDelay(3000)
				);
			});
		}

		$scope.closeMessageBox = function() { 
			$mdDialog.hide(); 
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'public/modules/home/partials/dialog1.tmpl.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
				fullscreen: $scope.customFullscreen,
				p:p,
			});

		};
	}

	function BookingController($scope, $mdDialog, $mdToast, $location,  p, owner) {

		$scope.p = p;
		$scope.owner = owner;
		$scope.booking = {};
		$scope.booking.owner = owner._id;
		$scope.booking.parking = p._id;
		$scope.booking.dates = {};

		$scope.closeBookingBox = function() { 
			$mdDialog.hide(); 
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'public/modules/home/partials/dialog1.tmpl.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
				fullscreen: $scope.customFullscreen,
				p:p,
			});
		};

		$scope.bookParking = function () {
			console.log($scope.booking);

			$http.post('/booking/create/', {booking:$scope.booking}).
				success(function(data, status, headers, config) {
					$mdDialog.hide();
					$location.path('/bookings');
					$mdToast.show($mdToast.simple()
						.content("Park booked")
						.position('top right')
						.hideDelay(3000)
					);
			});
		}
	}



}]);

