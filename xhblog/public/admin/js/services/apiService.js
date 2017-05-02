angular.module('app').factory('apiService',['$http','$q',function($http,$q){
	
	var api={
			article:{
				list:'/api/admin/article/getArticles',
				romoveOne:'/api/admin/article/romoveOne'
				
			}
	}
	
	return api;
}])