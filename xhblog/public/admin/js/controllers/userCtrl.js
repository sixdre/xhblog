angular.module('app').controller('userCtrl',
		['$scope','defPopService','alertService','userService',
		 	function($scope,defPopService,alertService,userService){
	
	/*
	 * getUsers 获取用户
	 */
	function getUsers(){
		userService.getUsers().then(function(res){
			console.log(res);
			$scope.Users=res.data.users;
		}).catch(function(err){
			
		})
	}
	getUsers();
	
}])

