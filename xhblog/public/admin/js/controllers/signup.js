'use strict';
// signup controller
app.controller('SignupFormController', [
	'$scope', '$http', '$state','defPopService',function($scope, $http, $state,defPopService) {
		
	$scope.user = {};
	$scope.authError = null;
	$scope.signup = function() {
		$http.post('/admin_regist', { 
			username: $scope.user.username, 
			email: $scope.user.email, 
			password: $scope.user.password })
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
						defPopService.defPop({
							status:1,
							content:"注册成功!",
							callback:function(){
								$state.go('access.signin');
							}
						});
						break;
				}
			}, function(x) {
				$scope.authError = 'Server Error';
			});
	};
}]);