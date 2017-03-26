angular.module('app').factory('settingService',['$http','$q',function($http,$q){

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
		post_banner:function(data){
			function ss(){
				var deferred=$q.defer();
				var config={
					method:"POST",
					url:'/admin/banner',
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
		loadFriend:function(){
			return handelRequest("GET","/admin/friend");
		},
		addFriend:function(data){
			return handelRequest("POST","/admin/friend",data);
		},
		delFriend:function(id){
			return handelRequest("POST","/admin/friend/remove",{id:id});
		},
		updateFriend:function(data){
			return handelRequest("POST","/admin/friend/update",data);
		}
	}
	
}])