angular.module('app').factory('articleService',['$http','$q',function($http,$q){

	/*function handelRequest(method,url,data){
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
	}*/
	
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
		
		return $http(config);		//angular $http返回的是一个promise对象
	}
	
	
	
	return {
		removeOne:function(id){
			return handelRequest("POST",'/api/article/romoveOne',{id:id});
		},
		removeMulti:function(ids){
			return handelRequest("POST",'/api/article/removeMulti',{ids:ids});
		},
//		save:function(data){
//			return $http({
//				method:"POST",
//				url:'/api/article/sub',
//				data:data,
//				headers: {'Content-Type':undefined},
//        		transformRequest:angular.identity   
//			});
//		},
		publish:function(data){
			return handelRequest("POST",'/api/article/publish',data);
		},
		search:function(title){
			return handelRequest("GET",'/api/article/search',{title:title});
		},
		getData:function(params){
			return handelRequest("GET",'/api/article',params);
		},
		findById:function(id){
			return handelRequest("GET",'/api/article/findById',{id:id});
		},
		update:function(arg){
			return handelRequest("POST",'/api/article/update',arg);
		}
		
		
	}
	
}])