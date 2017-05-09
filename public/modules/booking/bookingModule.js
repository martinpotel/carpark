var bookingModule = angular.module('bookingModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
bookingModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/bookings', {
		templateUrl: 'modules/booking/partials/view.html',
		controller: 'BookingController'
	});
}]);

bookingModule.controller('BookingController', function($scope, $http, $location, $mdToast, $mdDialog) {
		
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
			$http.get('/booking/user/'+ $scope.user._id).success(function(bookings){
  				$scope.bookings = bookings;
			});	
		}
	});

	$scope.goToPayment = function (booking) {
		if (!booking.payed) {
			$location.path("/payment/"+booking._id);
		}else{
			$mdDialog.show(
				$mdDialog.alert()
					.title('')
					.textContent('This reservation has already been paid.')
					.ariaLabel('alert paid') 
					.ok('OK')
			);
		}
		
	}

	$scope.getInformations = function ($event,b) {
		$scope.currBooking = b;

		console.log($scope.currBooking);

		$mdDialog.show({
			controller: function () { this.parent = $scope; },
			controllerAs: 'ctrl',
			templateUrl: '/public/modules/booking/partials/infos.tmpl.html',
			clickOutsideToClose:true
	    });
	}

});