/**
    Copyright POTEL Martin --- CarParking

    Payment controller
*/

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
	
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			if(typeof $routeParams.id !== 'undefined') {
				$http.get('/booking/get/'+$routeParams.id).success(function(data) {
					$scope.card = {};
					$scope.booking = data;
					$scope.process = false;
				});
			}
		}
	});

	
	$scope.processPayment = function () {
		$scope.process = true;
		$http.post('/payment/create', {card:$scope.card, booking:$scope.booking}).
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
	}

}]);
paymentModule.controller('PaymentControllerFinished', ['$scope','$http','$location','$routeParams','$mdToast', function($scope,$http,$location,$routeParams,$mdToast) {
	

}]);