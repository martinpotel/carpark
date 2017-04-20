var bookingModule = angular.module('bookingModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
bookingModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/bookings', {
		templateUrl: 'modules/booking/partials/view.html',
		controller: 'BookingController'
	});
}]);

bookingModule.controller('BookingController', function($scope, $http, $location, $mdToast) {
		
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
			$http.get('/booking/user/'+ $scope.user._id).success(function(bookings){
				console.log(bookings);
  				$scope.bookings = bookings;
			});	
		}
	});

});