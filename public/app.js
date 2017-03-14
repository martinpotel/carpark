var rgeApp = angular.module('rgeApp', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial', 'homeModule', 'noteModule']);

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

/*
	Affichage de la barre de chargement, et ajustement du holder de la toolbar et du sidenav en fonction de la taille
	Code Google Analytics
*/
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

	$rootScope.$on('$routeChangeSuccess', function () {
	    $("body").animate({scrollTop:0}, '500');
	    $mdSidenav('left').close();
	});

	$rootScope.$on('$viewContentLoaded', function() {
		$('#mainProgressBar').fadeOut('slow');
	});
});

/*
	nl2br custom filter
*/
rgeApp.filter('nl2br', function($sce){
    return function(msg,is_xhtml) { 
        var is_xhtml = is_xhtml || true;
        var breakTag = (is_xhtml) ? '<br />' : '<br>';
        var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
        return $sce.trustAsHtml(msg);
    }
});