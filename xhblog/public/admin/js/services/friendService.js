angular.module('app').factory('friendService',['$http','$q',function($http,$q){

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