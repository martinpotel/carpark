var rgeApp = angular.module('rgeApp', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial', 'homeModule', 'noteModule', 'loginModule', 'registerModule', 'rentModule', 'profileModule', 'parkingModule', 'messageModule', 'bookingModule', 'adminModule', 'reservationModule', 'findModule', 'paymentModule']);

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

rgeApp.config(['$httpProvider', function($httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);


rgeApp.directive('mainMenuButton', function($mdSidenav) {
	return {
	  	link: function(scope, elem, attr) {
			scope.openMainMenu = function() {
				$mdSidenav('left').toggle();
			}
		},
		template: '<div class="hide show-gt-md toolBarDesktopTitle"></div><md-button ng-click="openMainMenu()" class="md-icon-button hide-gt-md"><md-icon>menu</md-icon></md-button>'
	};
});


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



