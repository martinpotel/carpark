var messageModule = angular.module('messageModule', ['ngRoute', 'ngSanitize', 'ngCookies', 'ngMaterial']);

/* Routing */
messageModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/messages', {
		templateUrl: 'modules/message/partials/view.html',
		controller: 'MessageController'
	});
}]);

messageModule.controller('MessageController', function($scope, $http, $location, $mdToast, $mdDialog) {
		
	$http.get('/user/logged-user/').success(function(data){
		if (typeof data === 'undefined' || data === 'undefined') $location.path('/login');
		else {
			$scope.user = data;
			$http.get('/message/all/').success(function(messages){
  				$scope.messages = messages;
  				console.log(messages);
			});	
		}
	});

	$scope.read = function (ev, message) {
		$scope.message = message;
		$http.post('/message/mark-as-read/', {message:$scope.message}).
			success(function(data, status, headers, config) {
				$scope.message.read = true;
		});
	}

	$scope.reply = function (ev, message) {
		$mdDialog.show({
			controller: MessageController,
			templateUrl: 'public/modules/message/partials/reply.tmpl.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: $scope.customFullscreen,
			message:message
		}); 
	}

	$scope.deleteMessage = function(ev, m) {	
		var confirm = $mdDialog.confirm()
			.title('Delete the parking ?')
			.textContent('Are you sure that you want to remove this message ?')
			.ariaLabel("Confirm")
			.targetEvent(ev)
			.ok('Yes')
			.cancel('No');
		$mdDialog.show(confirm).then(function() {
			$http.get('/message/delete/'+m._id).
			success(function(data) {
				$mdToast.show(
					$mdToast.simple()
					.content('Message deleted.')
					.position('top right')
					.hideDelay(3000));
				var index = $scope.messages.indexOf(m);
  				$scope.messages.splice(index, 1);     
			}).
			error(function(data, status, headers, config) {
				$mdToast.show($mdToast.simple()
					.content('Error')
					.position('top right')
					.hideDelay(3000));
			});
		}, function() {
			$location.path("/messages");
		});
	}


	function MessageController($scope, $mdDialog, $mdToast, message) {
		$scope.message = message;

		$scope.reply = {to:$scope.message.from, parking:$scope.message.parking};

	  	$scope.sendMessage = function () {
	  		$http.post('/message/send/', {message:$scope.reply}).
				success(function(data, status, headers, config) {
					$http.post('/message/mark-as-read/', {message:$scope.message}).
						success(function(data, status, headers, config) {
							$mdDialog.hide();
							$mdToast.show($mdToast.simple()
								.content("Message sent")
								.position('top right')
								.hideDelay(3000)
							);
							$scope.message.read = true;
					});
			});
	  	}

	  	$scope.closeMessageBox = function() {
	      $mdDialog.hide();
	    };
	  

  	}
});