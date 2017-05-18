/**
    Copyright POTEL Martin --- CarParking

    Wallet controller
*/

var walletModule = angular.module('walletModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
walletModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/wallet', {
		templateUrl: 'modules/wallet/partials/view.html',
		controller: 'WalletController'
	});
}]);

walletModule.controller('WalletController', ['$scope','$http','$location','$routeParams','$mdToast', '$mdDialog', function($scope,$http,$location,$routeParams,$mdToast,$mdDialog) {
	

	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
		}
	});

	$scope.processPayment = function () {
		$http.post('/payment/bank-transfer/', {bank:$scope.bank, user:$scope.user}).
			success(function(data){
				$scope.user.wallet = 0;
				$mdToast.show($mdToast.simple()
					.content("Bank transfer done")
					.position('top right')
					.hideDelay(3000)
				);
		});
	}


}]);