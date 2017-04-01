var rgeApp = angular.module('rgeApp', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial', 'homeModule', 'noteModule', 'loginModule', 'registerModule', 'rentModule']);

/* Angular material theme */
rgeApp.config(function($mdThemingProvider) {
	$mdThemingProvider
		.theme('forest')
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
	$rootScope.$on('$routeChangeStart', function (ev,nextRoute) {
		$('#mainProgressBar').fadeIn('slow');
		if(typeof nextRoute.$$route === 'undefined') $('#toolBarVirtual').removeClass('withTabs');
		else {
			var path = nextRoute.$$route.originalPath;
			if(path.substring(0,12) == '/simulation/' && path != '/simulation/resultats' && path != '/simulation/finish3') {
				$('#toolBarVirtual').addClass('withTabs');
				$('md-sidenav').addClass('withTabs');
			}
			else {
				$('#toolBarVirtual').removeClass('withTabs');
				$('md-sidenav').removeClass('withTabs');
			}
		}
	});

	$rootScope.$on('$routeChangeError', function () {
		$('#mainProgressBar').fadeOut('slow');
	});


	$rootScope.$on('$viewContentLoaded', function() {
		$('#mainProgressBar').fadeOut('slow');
	});
});



