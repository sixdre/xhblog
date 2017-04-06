'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
	$scope.user = {};
	$scope.authError = null;
	$scope.signup = function() {
		// Try to create
		$http.post('/admin/regist', { username: $scope.user.username, email: $scope.user.email, password: $scope.user.password })
			.then(function(res) {
				var code = res.data.code;
				var message = res.data.message;
				switch(code) {
					case -1:
						$scope.authError = message;
						break;
					case -2:
						$scope.authError = message;
						break;
					case 1:
						$state.go('access.signin');
						break;
				}
			}, function(x) {
				$scope.authError = 'Server Error';
			});
	};
}]);