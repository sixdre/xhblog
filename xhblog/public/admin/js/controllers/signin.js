'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ["$rootScope",'$scope', '$http', '$state', function($rootScope,$scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.login = function() {
      $scope.authError = null;
      // Try to login
      $http.post('/admin/login', {username: $scope.user.username, password: $scope.user.password})
      .then(function(response) {
    	  var code=response.data.code;
    	  if(code==-1){
    		  alert("账号不存在");
    	  }else if(code==1){
    		  /*$rootScope.$state.isLogin = true;*/
    		  $state.go('app.article.publish');
    	  }else{
    		  alert("密码错误!");
    	  }
        /*if ( !response.data.user ) {
          $scope.authError = 'Email or Password not right';
        }else{
          $state.go('app.dashboard-v1');
        }*/
      }, function(err) {
        $scope.authError = 'Server Error';
      });
    };
  }])
;