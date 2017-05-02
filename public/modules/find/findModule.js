/*
	Home page display
*/

var findModule = angular.module('findModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial','vsGoogleAutocomplete', 'ngMap']);

/* Routing */
findModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/find', {
			templateUrl: 'modules/find/partials/home.html',
			controller: 'FindController'
		});
}]);

/*
	Displays home page and username
*/
findModule.controller('FindController', ['$scope','$http', '$mdDialog', '$location', function($scope, $http,$mdDialog, $location) {


	$scope.map = {};
	$scope.address = {};
	$scope.notifs = true;

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
			templateUrl: 'public/modules/find/partials/dialog1.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: $scope.customFullscreen,
			p:p,
		});
	};

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
						templateUrl: 'public/modules/find/partials/message.tmpl.html',
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
						templateUrl: 'public/modules/find/partials/booking.tmpl.html',
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
				templateUrl: 'public/modules/find/partials/dialog1.tmpl.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
				fullscreen: $scope.customFullscreen,
				p:p,
			});

		};
	}

	function BookingController($scope, $mdDialog, $mdToast, $location,  p, owner) {

		$scope.message = null;

		$scope.p = p;
		$scope.owner = owner;
		$scope.booking = {};
		$scope.booking.owner = owner._id;
		$scope.booking.parking = p._id;
		$scope.booking.dates = {start:new Date(), end: new Date()};

		$scope.price = dateDiff($scope.booking.dates.start, $scope.booking.dates.end) * $scope.p.price;

		$scope.closeBookingBox = function() { 
			$mdDialog.hide(); 
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'public/modules/find/partials/dialog1.tmpl.html',
				parent: angular.element(document.body),
				clickOutsideToClose:true,
				fullscreen: $scope.customFullscreen,
				p:p,
			});
		};

		$scope.bookParking = function () {
			if ($scope.booking.dates.start < new Date()) {
				$scope.message = 'Please select a valid date';
			}else if ($scope.booking.dates.start > $scope.booking.dates.end) {
				$scope.message = 'Please select a valid date';
			}else {
				$http.post('/booking/create/', {booking:$scope.booking}).
				success(function(data, status, headers, config) {
					if (data.error) {
						$scope.message = 'Parking not available for theses dates.';
					}else {
						$mdDialog.hide();
						$location.path('/bookings');
						$mdToast.show($mdToast.simple()
							.content("Park booked")
							.position('top right')
							.hideDelay(3000)
						);
					}
					
				});
			}			
		}

		$scope.setPrice = function () {

			if ($scope.booking.dates.start < new Date()) {
				$scope.message = 'Please select a valid date';
			}else if ($scope.booking.dates.start > $scope.booking.dates.end) {
				$scope.message = 'Please select a valid date';
			}else {
				$scope.message = null;
			}


			$scope.price = dateDiff($scope.booking.dates.start, $scope.booking.dates.end) * $scope.p.price;
			if ($scope.price < 0) $scope.price = 0;

		} 

		function dateDiff(date1, date2){
		    var diff = {}                          
		    var tmp = date2 - date1;
		 
		    tmp = Math.floor(tmp/1000);            
		    diff.sec = tmp % 60;                   
		 
		    tmp = Math.floor((tmp-diff.sec)/60);   
		    diff.min = tmp % 60;                   
		 
		    tmp = Math.floor((tmp-diff.min)/60);    
		    diff.hour = tmp % 24;                   
		     
		    tmp = Math.floor((tmp-diff.hour)/24);  
		    diff.day = tmp;
		    

		    return diff.day +1;
		}
	}



}]);

