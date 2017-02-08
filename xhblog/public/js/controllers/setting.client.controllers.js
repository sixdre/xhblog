angular.module('app').controller('settingCtrl',['$scope','$http','$window','defPopService','settingServices',function($scope,$http,$window,defPopService,settingServices){

	$scope.addbanner=function(){
		var formData = new FormData($("#banner_form")[0]);
		settingServices.post_banner(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				defPopService.defPop({
					status:1,
					content:"添加成功！"
				});
			}
		},function(err){
			
		})
	};
	
	$scope.addfriend=function(){
		var formData={
			title:$scope.friend_title,
			url:$scope.friend_url
		};
		settingServices.addFriend(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				defPopService.defPop({
					status:1,
					content:"添加成功！"
				});
			}
		},function(err){
			
		})
		return false;
	}
	
	
}])

