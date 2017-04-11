'use strict';
/* Controllers */
// signin controller
app.controller('SigninFormController', 
["$rootScope", '$scope','$cookies', '$http', '$state','ConstantService',
function($rootScope, $scope,$cookies,$http, $state,ConstantService) {
	$scope.user = {};
	$scope.authError = null; //错误信息
	var expireDate = new Date();
    expireDate.setMinutes(expireDate.getMinutes()+10*6);		//一小时
	$scope.login = function() {
		$http.post('/admin/login', { 
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
						$cookies.put(ConstantService.LOGIN_USER,$scope.user.username,{'expires': expireDate})
						$state.go('app.article.publish');
						break;
				}
			}, function(err) {
				$scope.authError = 'Server Error';
			});
	};
}]);