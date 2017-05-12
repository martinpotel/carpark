var reservationModule = angular.module('reservationModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
reservationModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/reservations', {
		templateUrl: 'modules/reservation/partials/list.html',
		controller: 'ReservationController'
	});
}]);

reservationModule.controller('ReservationController', function($scope, $http, $location, $mdToast, $mdDialog) {
		
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
			$http.get('/booking/owner/'+ $scope.user._id).success(function(bookings){
  				$scope.bookings = bookings;
			});	
		}
	});

	$scope.getInformations = function (ev,b) {
		$scope.currBooking = b;
		$mdDialog.show({
			controller: function () { this.parent = $scope; },
			controllerAs: 'ctrl',
			templateUrl: '/public/modules/booking/partials/infos.tmpl.html',
			clickOutsideToClose:true
	    });
	}

	$scope.acceptReservation = function (ev,b) {
		var confirm = $mdDialog.confirm()
			.title('Accept the reservation ?')
			.textContent('Are you sure that you want to accept the reservation ?')
			.ariaLabel("Confirm")
			.targetEvent(ev)
			.ok('Yes')
			.cancel('No');
		$mdDialog.show(confirm).then(function() {
			$http.get('/booking/accept/'+b._id).
			success(function(data) {
				$mdToast.show(
					$mdToast.simple()
					.content('Reservation accepted.')
					.position('top right')
					.hideDelay(3000));
				b.status = 'accepted';
			}).
			error(function(data, status, headers, config) {
				$mdToast.show($mdToast.simple()
					.content('Error')
					.position('top right')
					.hideDelay(3000));
			});
		}, function() {
			$location.path("/reservations");
		});
	}

	$scope.declineReservation = function (ev,b) {
		var confirm = $mdDialog.confirm()
			.title('Decline the reservation ?')
			.textContent('Are you sure that you want to decline the reservation ?')
			.ariaLabel("Confirm")
			.targetEvent(ev)
			.ok('Yes')
			.cancel('No');
		$mdDialog.show(confirm).then(function() {
			$http.get('/booking/decline/'+b._id).
			success(function(data) {
				$mdToast.show(
					$mdToast.simple()
					.content('Reservation declined.')
					.position('top right')
					.hideDelay(3000));
				b.status = 'declined';
			}).
			error(function(data, status, headers, config) {
				$mdToast.show($mdToast.simple()
					.content('Error')
					.position('top right')
					.hideDelay(3000));
			});
		}, function() {
			$location.path("/reservations");
		});
	}

});