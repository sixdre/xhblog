angular.module('app').factory('articleService',['$http','$resource','$q','Upload',function($http,$resource,$q,Upload){

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
		if(method==="POST"||method==="PUT"){
			config.data=data;
		}else{
			config.params=data;
		}
		return $http(config);
	}
	var Article=$resource('/api/article/:id/publish',{id:'@id'});
	
	return {
//		testGetDataByResource:function(){
//			Article.delete({id:1},function(articles){
//				console.log(articles);
//			},function(articles){
//				console.log(articles);
//			})
//		},
//		testGetDataByResource2:function(){
//			Article.get({id:1},function(articles){
//				console.log(articles);
//			},function(articles){
//				console.log(articles);
//			})
//		},
//		testGetDataByResource3:function(){
//			Article.get({id:1},function(articles){
//				console.log(articles);
//			},function(articles){
//				console.log(articles);
//			})
//		},
		getData:function(params){		//获取文章数据
			return handelRequest("GET",'/api/articles',params);
		},
		publish:function(data){			//文章发布
			return Upload.upload({
				url: '/api/article',
				data: data
			})
		},
		update:function(data){		//文章更新
			return Upload.upload({
				url: '/api/article',
				method:"PUT",
				data:data
			})
		},
		removeOne:function(id){		//文章单选删除
			return handelRequest("DELETE",'/api/article/'+id);
		},
		removeMulti:function(ids){	//文章多选删除
			return handelRequest("POST",'/api/article/removeMulti',{ids:ids});
		},
		search:function(title){		//搜索文章
			return handelRequest("GET",'/api/article/search',{title:title});
		},
		findById:function(id){
			return handelRequest("GET",'/api/article/'+id);
		}
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
//			return handelRequest("GET",'/api/article/'+id);
//		}
	}
	
}])