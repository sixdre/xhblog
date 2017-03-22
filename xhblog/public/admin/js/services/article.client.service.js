angular.module('app').factory('articleService',['$http','$q',function($http,$q){

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
		list:function(data){
			return handelRequest("GET",'/admin/article/list',data);
		},
		remove:function(id){
			return handelRequest("POST",'/admin/article/remove',{id:id});
		},
		save:function(data){
			function ss(){
				var deferred=$q.defer();
				var config={
					method:"POST",
					url:'/admin/article/sub',
					data:data,
					headers: {'Content-Type':undefined},
              		transformRequest:angular.identity   
				};
				$http(config).then(function(data){
					deferred.resolve(data);
				}).catch(function(data){
					deferred.reject(data);
				})
				return deferred.promise;
			};
			
			return ss();
			
		},
		publish:function(data){
			return handelRequest("POST",'/admin/article/publish',data);
		},
		search:function(title){
			return handelRequest("POST",'/admin/article/search',{title:title});
		},
		page:function(arg){
			return handelRequest("POST",'/admin/article/page',arg);
		},
		find:function(id){
			return handelRequest("POST",'/admin/article/find',{id:id});
		},
		update:function(arg){
			return handelRequest("POST",'/admin/article/update',arg);
		}
		
		
	}
	
}])