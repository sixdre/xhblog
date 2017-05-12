angular.module('app').controller('friendCtrl',
		['$scope','defPopService','alertService','friendService',
		 	function($scope,defPopService,alertService,friendService){

	$scope.isNewHandle=true;			//判断当前是新增友链还是更新友链
	
	/*
	 * getFriends 加载友情链接
	 * */
	function getFriends(){
		friendService.list({page:1,limit:10}).then(function(res){
			$scope.Friends=res.data.friends;
		}).catch(function(err){
			alertService.error('获取友链数据失败,服务器错误');
		})
	}
	getFriends();
	/*
	 * addfriend 添加友情链接
	 * */
	$scope.addFriend=function(obj){
		friendService.add(obj).then(function(res){
			if(res.data.code>0){
				$scope.friend={};
				$scope.Friends.push(res.data.friend);
				alertService.success(res.data.message);
			}else if(res.data.code==-2){
				alertService.error(res.data.message);
			}
		}).catch(function(err){
			alertService.error('服务器错误');
			console.log(err);
		})
		return false;
	},
	/*
	 * delfriend 删除链接
	 * */
	$scope.delFriend=function(item){	
		alertService.confirm().then(function(){
			friendService.remove(item._id).then(function(res){
				if(res.data.code==1){
					alertService.success(res.data.message);
					$scope.Friends.splice($scope.Friends.indexOf(item), 1);
				}
			}).catch(function(err){
				alertService.error('服务器错误');
			})
		},function(){
			
		})
	}
	/*
	 * editFriend 更新友链
	 * */
	$scope.editFriend=function(item){
		$scope.isNewHandle=false;
		$scope.friend=angular.copy(item);
	}
	
	$scope.updateFriend=function(item){
		friendService.update(item).then(function(res){
			if(res.data.code==1){
				alertService.success(res.data.message);
				$scope.friend={};
				$scope.isNewHandle=true;
				getFriends();
			}
		}).catch(function(err){
			alertService.error('更新失败,服务器错误!');
			console.log(err);
		})
	}
	
	//取消更新修改
	$scope.cancel=function(){		
		$scope.friend={};
		$scope.isNewHandle=true;
	}
	

	
	
	
	
}])

