angular.module('app').controller('friendCtrl',
		['$scope','defPopService','alertService','friendService',
		 	function($scope,defPopService,alertService,friendService){

	$scope.isNewHandle=true;			//判断当前是新增友链还是更新友链
	
	/*
	 * loadfriend 加载友情链接
	 * */
	$scope.loadfriend=function(){
		friendService.loadFriend().then(function(res){
			$scope.friends=res.data.friends;
		}).catch(function(err){
			
		})
	};
	/*
	 * addfriend 添加友情链接
	 * */
	$scope.addfriend=function(obj){
		friendService.addFriend(obj).then(function(res){
			var data=res.data;
			if(data.code>0){
				$scope.friend={};
				$scope.friends.push(data.friend);
				alertService.success('添加成功!');
			}else if(data.code==-1){
				alertService.error('此用户已经添加过了！');
			}
		}).catch(function(err){
			
		})
		return false;
	},
	/*
	 * delfriend 删除链接
	 * */
	$scope.delfriend=function(item){	
		alertService.confirm().then(function(){
			friendService.delFriend(item._id).then(function(res){
				if(res.data.code==1){
					alertService.success(res.data.message);
					$scope.friends.splice($scope.friends.indexOf(item), 1);
				}
			}).catch(function(err){
				
			})
		},function(){
			
		})
	}
	/*
	 * editFriend 更新友链
	 * */
	$scope.editfriend=function(item){
		$scope.isNewHandle=false;
		$scope.friend=angular.copy(item);
	}
	$scope.updatefriend=function(item){
		friendService.addFriend(item).then(function(res){
			console.log(res);
			var p=new Promise(function(resolve,reject){
				if(res.data.code==1){
					resolve(res.data.message);
				}else{
					reject('错误')
				}
			})
			return p;
		}).then(function(msg){
			alertService.success('更新成功!');
			$scope.friend={};
			$scope.isNewHandle=true;
			$scope.loadfriend();
		},function(err){
			alertService.error()
		}).catch(function(err){
			console.log(err);
		})
	}
	
	$scope.cancel=function(){		//取消更新修改
		$scope.friend={};
		$scope.isNewHandle=true;
	}
	
	$scope.loadfriend();
	
	
	
	
}])

