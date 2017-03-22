angular.module('app').factory('categoryService',['$http','$q',function($http,$q){

	function handelRequest(method,url,data){
		var deferred=$q.defer();
		var config={
			method:method,
			url:url
		};
		if(method==="POST"){
			config.data=data;
		}else{
			config.params=data;
		}
		
		$http(config).then(function(data){
			deferred.resolve(data);
		}).catch(function(data){
			deferred.reject(data);
		})
		
		return deferred.promise;
	}

	var api={
		category:{
			list:function(){
				return handelRequest("GET",'/admin/category');
			},
			remove:function(data){
				return handelRequest("POST",'/admin/category/remove',data);
			},
			add:function(data){
				console.log(data);
				return handelRequest("POST",'/admin/category',data);
			}
		},
		tag:{
			list:function(){
				return handelRequest("GET",'/admin/tag');
			},
			remove:function(data){
				return handelRequest("POST",'/admin/tag/remove',data);
			},
			add:function(data){
				return handelRequest("POST",'/admin/tag',data);
			}
		}
	}
	
	return api;
	
}])