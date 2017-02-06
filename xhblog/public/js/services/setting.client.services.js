angular.module('app').factory('settingServices',['$http','$q',function($http,$q){
	
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
		submit:function(data){
			function ss(){
				var deferred=$q.defer();
				var config={
					method:"POST",
					url:'/admin/setting/sub',
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
			
		}
	}
	
}])