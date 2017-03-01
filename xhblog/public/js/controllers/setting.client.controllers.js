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
	
	
	$scope.isNewHandle=true;			//判断当前是新增友链还是更新友链
	
	/*
	 * loadfriend 加载友情链接
	 * */
	$scope.loadfriend=function(){
		settingServices.loadFriend().then(function(res){
			$scope.friends=res.data.doc;
		},function(err){
			
		})
	};
	/*
	 * addfriend 添加友情链接
	 * */
	$scope.addfriend=function(){
		var formData={
			title:$scope.friend.title,
			url:$scope.friend.url,
			logo:$scope.friend.logo,
			sort:$scope.friend.sort
		};
		settingServices.addFriend(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				defPopService.defPop({
					status:1,
					content:"添加成功！",
					callback:function(){
						$scope.friend={};
						$scope.friends.push(formData);
					}
				});
			}
		},function(err){
			
		})
		return false;
	},
	/*
	 * delfriend 删除链接
	 * */
	$scope.delfriend=function(id){
		settingServices.delFriend(id).then(function(res){
			if(res.data.code==1){
				defPopService.defPop({
					status:1,
					content:"删除成功！",
					callback:function(){
						$scope.friends.splice($.inArray(id, $scope.array), 1);
					}
				});
			}
		},function(err){
			
		})
	}
	/*
	 * editFriend 更新友链
	 * */
	$scope.editfriend=function(item){
		$scope.isNewHandle=false;
		$scope.friend=item;
	}
	$scope.updatefriend=function(item){
		settingServices.updateFriend(item).then(function(res){
			if(res.data.code==1){
				defPopService.defPop({
					status:1,
					content:"更新成功！",
					callback:function(){
						$scope.friend={};
						$scope.isNewHandle=true;
					}
				});
			}
		},function(err){
			
		})
	}
	
	$scope.loadfriend();
	
	
	
	
}])

