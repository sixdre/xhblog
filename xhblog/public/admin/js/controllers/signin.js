'use strict';
/* Controllers */
// signin controller
app.controller('SigninFormController', 
["$rootScope", '$scope','$cookies', '$http', '$state','USER','AUTH_EVENTS',
function($rootScope, $scope,$cookies,$http, $state,USER,AUTH_EVENTS) {
	$scope.user = {};
	$scope.authError = null; //错误信息
	var expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes()+10*6);		//一小时
	$scope.login = function() {
		$http.post('/admin_login', { 
			username: $scope.user.username, 
			password: $scope.user.password })
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
						$cookies.put(USER.user_name,$scope.user.username,{'expires': expireDate});
						$scope.$emit(AUTH_EVENTS.loginSuccess,'登陆成功');
						$state.go('app.article.list');
						break;
				}
			}, function(err) {
				$scope.authError = 'Server Error';
			});
	};
}]);