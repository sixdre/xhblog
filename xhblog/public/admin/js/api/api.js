angular.module('app').factory('ApiServices',function(){
	var api={
		article:{
			list:'/admin/article/list',
			remove:'/admin/article/remove'
		}	
	}
	
	return api;
	
})