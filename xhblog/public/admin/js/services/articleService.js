angular.module('app').factory('articleService',['$http','$q','Upload',function($http,$q,Upload){

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
		return $http(config);
	}
	
	return {
		getData:function(params){		//获取文章数据
			return handelRequest("GET",'/api/article',params);
		},
		publish:function(data){			//文章发布
			return Upload.upload({
				url: '/api/article/publish',
				data: data
			})
		},
		update:function(data){		//文章更新
			return Upload.upload({
				url: '/api/article/update',
				data:data
			})
		},
		removeOne:function(id){		//文章单选删除
			return handelRequest("POST",'/api/article/romoveOne',{id:id});
		},
		removeMulti:function(ids){	//文章多选删除
			return handelRequest("POST",'/api/article/removeMulti',{ids:ids});
		},
		search:function(title){		//搜索文章
			return handelRequest("GET",'/api/article/search',{title:title});
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
//		findById:function(id){
//			return handelRequest("GET",'/api/article/findById',{id:id});
//		}
	}
	
}])