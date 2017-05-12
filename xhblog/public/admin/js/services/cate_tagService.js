angular.module('app').factory('catetagService',['$http','$q',function($http,$q){

	function handelRequest(method,url,data){
		var config={
			method:method,
			url:url
		};
		if(method==="POST"||method==="PUT"){
			config.data=data;
		}else{
			config.params=data;
		}
		return $http(config);		
	}

	var api={
		category:{
			list:function(){
				return handelRequest("GET",'/api/category');
			},
			add:function(data){
				return handelRequest("POST",'/api/category',{category:data});
			},
			update:function(data){
				return handelRequest("PUT",'/api/category',{category:data});
			},
			remove:function(id){
				return handelRequest("DELETE",'/api/category/'+id);
			}
			
		},
		tag:{
			list:function(){
				return handelRequest("GET",'/api/tag');
			},
			add:function(data){
				return handelRequest("POST",'/api/tag',{tag:data});
			},
			update:function(data){
				return handelRequest("PUT",'/api/tag',{tag:data});
			},
			remove:function(id){
				return handelRequest("DELETE",'/api/tag/'+id);
			}
		}
	}
	
	return api;
	
}])