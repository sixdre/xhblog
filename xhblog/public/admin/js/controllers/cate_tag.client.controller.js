angular.module('app')
	.controller('categoryCtrl',
			['$rootScope','$scope','$http','$window','defPopService','alertService','categoryService',
   function($rootScope,$scope,$http,$window,defPopService,alertService,categoryService){
	
	
	$scope.iscNew=true;   //判断类型是更新还是添加
	$scope.istNew=true;   //判断标签是更新还是添加
	$scope.category={};
	/*$scope.list=function(){			//加载所有的分类
		categoryService.list().then(function(res){
			console.log(res.data.categorys);
			$scope.categorys=res.data.categorys;
		}).catch(function(){
			
		});
	}*/
	$scope.revise=function(type,data){
		if(type=="category"){
			$scope.category=data;
			$scope.iscNew=false;
		}else if(type="tag"){
			$scope.tag=data;
			$scope.istNew=false;
		}
	}
	
	//分类和标签的删除
	$scope.remove=function(type,item){			
		if(type=="category"){				//删除分类
			alertService.confirm().then(function(){
				categoryService.category.remove({category:item}).then(function(res){
					if(res.data.code==1){
						alertService.success();
						$rootScope.categorys.splice($rootScope.categorys.indexOf(item), 1);
					}
				}).catch(function(){
					
				});
			},function(){
				
			})
		}else if(type="tag"){
			alertService.confirm().then(function(){
				categoryService.tag.remove({tag:item}).then(function(res){
					if(res.data.code==1){
						alertService.success();
						$rootScope.tags.splice($rootScope.tags.indexOf(item), 1);
					}
				}).catch(function(){
					
				});
			},function(){
				
			})
		}					
	}
	
	//分类或者标签的保存
	$scope.add=function(type){				//保存分类
		if(type=="category"){

			categoryService.category.add({category:$scope.category}).then(function(res){
				console.log(res.data);
				if(res.data.code==-1){
					defPopService.defPop({
						status:0,
						content:"已有此类型，不可重复添加"
					});
				}else if(res.data.code==1){
					defPopService.defPop({
						status:1,
						content:"添加成功",
						callback:function(){
							$rootScope.categorys.push(res.data.category);
							$scope.category={};
						}
					});
				}else if(res.data.code==2){
					defPopService.defPop({
						status:1,
						content:"修改成功",
						callback:function(){
							$scope.iscNew=true;
							$scope.category={};
						}
					});
				}
			}).catch(function(){
				
			});
		}else if(type=="tag"){
			console.log($scope.tag)
			categoryService.tag.add({tag:$scope.tag}).then(function(res){
				console.log(res.data);
				if(res.data.code==-1){
					defPopService.defPop({
						status:0,
						content:"已有此类型，不可重复添加"
					});
				}else if(res.data.code==1){
					defPopService.defPop({
						status:1,
						content:"添加成功",
						callback:function(){
							$rootScope.tags.push(res.data.tag);
							$scope.tag={};
						}
					});
				}else if(res.data.code==2){
					defPopService.defPop({
						status:1,
						content:"修改成功",
						callback:function(){
							$scope.istNew=true;
							$scope.tag={};
						}
					});
				}
			}).catch(function(){
				
			});
		}
	}	

	
	$scope.cancel=function(type){
		if(type=="category"){
			$scope.iscNew=true;
			$scope.category={};
		}else if(type=="tag"){
			$scope.istNew=true;
			$scope.tag={};
		}
	}
	
	
	
	
	
}]);