angular.module('app').factory('userService',['$http','$q',function($http,$q){

	return {
		getUsers:function(){
			return $http.get('/api/users')
		}
		
	}
	
}])