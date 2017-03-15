var rgeApp = angular.module('rgeApp', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial', 'homeModule', 'noteModule', 'loginModule', 'registerModule']);

/* Angular material theme */
rgeApp.config(function($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('lime')
		.accentPalette('brown');
});

/*
	Route not found redirects to home
*/
rgeApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.otherwise({
	    	redirectTo: '/'
	    });
}]);


rgeApp.run(function($rootScope, $timeout, $mdSidenav, $window, $location) {
	if(typeof $window.ga === 'function') {
		$window.ga('create', 'UA-68067706-1', 'auto');

		$rootScope.$on('$routeChangeSuccess', function () {
			$window.ga('send', 'pageview', $location.path());
		});
	}
});


