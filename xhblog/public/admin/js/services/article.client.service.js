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
			return handelRequest("GET",'/admin/article/getArticles',data);
		},
		removeOne:function(bId){
			return handelRequest("POST",'/admin/article/romoveOne',{bId:bId});
		},
		removeMulti:function(ids){
			return handelRequest("POST",'/admin/article/removeMulti',ids);
		},
		save:function(data){
			function ss(){
				var config={
					method:"POST",
					url:'/admin/article/sub',
					data:data,
					headers: {'Content-Type':undefined},
              		transformRequest:angular.identity   
				};
				return $http(config);
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