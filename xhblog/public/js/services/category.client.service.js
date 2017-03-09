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

	return {
		list:function(){
			return handelRequest("GET",'/admin/article/category');
		},
		remove:function(id){
			return handelRequest("POST",'',{id:id});
		},
		add:function(data){
			return handelRequest("POST",'/admin/article/category',data);
		}
		
	}
	
}])