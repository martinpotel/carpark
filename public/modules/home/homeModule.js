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
homeModule.controller('HomeController', ['$scope','$http', '$mdDialog', function($scope, $http,$mdDialog) {


	$scope.map = {};
	$scope.address = {};

	$http.get('/user/logged-user/').success(function(usr){
		$http.get('/parking/all').success(function(parks) {
			$scope.parkings = parks;
			$scope.user = usr;
			$scope.parkSelected = $scope.parkings[0];
			$scope.map.lat = $scope.parkSelected.address.location.lat;
			$scope.map.long = $scope.parkSelected.address.location.long;
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


  function DialogController($scope, $mdDialog, p) {

  	$scope.p = p;
  	$http.get('/parking/owner/'+ $scope.p.user).success(function(owner){
  		$scope.owner = owner;
  		$scope.p = p;
	});	


    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }



}]);

