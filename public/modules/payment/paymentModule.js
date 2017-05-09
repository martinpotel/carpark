var paymentModule = angular.module('paymentModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
paymentModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/payment/:id', {
		templateUrl: 'modules/payment/partials/view.html',
		controller: 'PaymentController'
	})
	.when('/payment/finished/:id', {
		templateUrl: 'modules/payment/partials/result.html',
		controller: 'PaymentControllerFinished'
	});
}]);

paymentModule.controller('PaymentController', ['$scope','$http','$location','$routeParams','$mdToast', '$mdDialog', function($scope,$http,$location,$routeParams,$mdToast,$mdDialog) {
	/*
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
			$http.get('/booking/owner/'+ $scope.user._id).success(function(bookings){
  				$scope.bookings = bookings;
			});	
		}
	});
	*/

	if(typeof $routeParams.id !== 'undefined') {
		console.log('coucou');
		$http.get('/booking/get/'+$routeParams.id).success(function(data) {
			$scope.card = {};
			$scope.booking = data;
		});
	}
	
	$scope.processPayment = function () {

		$http.post('/create', {card:$scope.card, booking:$scope.booking}).
			success(function(data){
				console.log(data);
			if (typeof data.error ==='undefined') {
				$location.path("/payment/finished/"+$scope.booking._id);
			}else{
				$mdDialog.show(
     			 $mdDialog.alert()
        			.title('')
        			.textContent('This reservation has already been paid.')
        			.ariaLabel('alert paid') 
       				.ok('OK')
    			);
    			$location.path("/bookings");
			}
			


		});
		/*
		$http.post('/payment/new/', {card:$scope.card, booking:$scope.booking}).
			success(function(data, status, headers, config) {
			$mdToast.show($mdToast.simple()
				.content("Payment valided")
				.position('top right')
				.hideDelay(3000)
			);
		});
		*/
	}

}]);
paymentModule.controller('PaymentControllerFinished', ['$scope','$http','$location','$routeParams','$mdToast', function($scope,$http,$location,$routeParams,$mdToast) {
	

}]);