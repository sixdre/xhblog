angular.module('app').factory('friendService',['$http','$q',function($http,$q){

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
	
	
	return {
		list:function(params){			
			return handelRequest("GET","/api/friend",params);
		},
		add:function(data){
			return handelRequest("POST","/api/friend",data);
		},
		update:function(data){
			return handelRequest("PUT","/api/friend",data);
		},
		remove:function(id){
			return handelRequest("DELETE","/api/friend/"+id);
		},
	}
	
}])