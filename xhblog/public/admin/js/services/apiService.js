angular.module('app').factory('apiService',['$http','$q',function($http,$q){
	
	var api={
			article:{
				list:'/admin/article/getArticles',
				romoveOne:'/admin/article/romoveOne'
				
			}
	}
	
	return api;
}])