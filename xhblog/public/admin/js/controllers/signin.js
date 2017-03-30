'use strict';

/* Controllers */
// signin controller
app.controller('SigninFormController', ["$rootScope", '$scope', '$http', '$state', function($rootScope, $scope, $http, $state) {
	$scope.user = {};
	$scope.authError = null; //错误信息
	$scope.login = function() {
		// Try to login
		$http.post('/admin/login', { username: $scope.user.username, password: $scope.user.password })
			.then(function(res) {
				var code = res.data.code;
				var message=res.data.message;
				switch(code) {
					case -1:
						$scope.authError = message;
						break;
					case -2:
						$scope.authError = message;
						break;
					case 1:
						$state.go('app.article.publish');
						break;
				}
			}, function(err) {
				$scope.authError = 'Server Error';
			});
	};
}]);