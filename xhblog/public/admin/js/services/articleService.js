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
		list:function(data){
			return handelRequest("GET",'/api/admin/article/getArticles',data);
		},
		removeOne:function(id){
			return handelRequest("POST",'/api/admin/article/romoveOne',{id:id});
		},
		removeMulti:function(ids){
			return handelRequest("POST",'/api/admin/article/removeMulti',{ids:ids});
		},
		save:function(data){
			return $http({
				method:"POST",
				url:'/api/admin/article/sub',
				data:data,
				headers: {'Content-Type':undefined},
          		transformRequest:angular.identity   
			});
		},
		publish:function(data){
			return handelRequest("POST",'/api/admin/article/publish',data);
		},
		search:function(title){
			return handelRequest("GET",'/api/admin/article/search',{title:title});
		},
		page:function(params){
			return handelRequest("GET",'/api/admin/article/page',params);
		},
		findById:function(id){
			return handelRequest("GET",'/api/admin/article/findById',{id:id});
		},
		update:function(arg){
			return handelRequest("POST",'/api/admin/article/update',arg);
		}
		
		
	}
	
}])