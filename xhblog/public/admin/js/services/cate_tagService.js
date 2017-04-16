angular.module('app').factory('catetagService',['$http','$q',function($http,$q){

	function handelRequest(method,url,data){
		var config={
			method:method,
			url:url
		};
		if(method==="POST"){
			config.data=data;
		}else{
			config.params=data;
		}
		return $http(config);		
	}

	var api={
		category:{
			list:function(){
				return handelRequest("GET",'/admin/category');
			},
			remove:function(data){
				return handelRequest("POST",'/admin/category/remove',{id:data});
			},
			add:function(data){
				return handelRequest("POST",'/admin/category',{category:data});
			}
		},
		tag:{
			list:function(){
				return handelRequest("GET",'/admin/tag');
			},
			remove:function(data){
				return handelRequest("POST",'/admin/tag/remove',{id:data});
			},
			add:function(data){
				return handelRequest("POST",'/admin/tag',{tag:data});
			}
		}
	}
	
	return api;
	
}])