'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      $http.post('/admin/doRegist', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
    	  var code=response.data.code;
    	  var message=response.data.message;
    	  if(code==-1){
    		  alert(message)
    	  }else if(code==-2){
    		  alert(message);
    	  }else if(code==1){
    		  alert(message);
    		  $state.go('access.signin');
    	  }
       /* if ( !response.data.user ) {
          $scope.authError = response;
        }else{
          $state.go('app.dashboard-v1');
        }*/
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
 ;