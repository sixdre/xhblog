angular.module('app').controller('categoryCtrl',['$rootScope','$scope','$http','$window','defPopService','categoryService',
   function($rootScope,$scope,$http,$window,defPopService,categoryService){
	
	$scope.isNew=true;   //判断是更新还是添加
	$scope.category={};
	/*$scope.list=function(){			//加载所有的分类
		categoryService.list().then(function(res){
			console.log(res.data.categorys);
			$scope.categorys=res.data.categorys;
		}).catch(function(){
			
		});
	}*/
	
	$scope.revise=function(data){
		$scope.category=data;
		$scope.isNew=false;
	}
	
	
	
	
	
	$scope.remove=function(item){			//删除分类
		categoryService.remove({category:item}).then(function(res){
			if(res.data.code==1){
				defPopService.defPop({
					status:1,
					content:"删除成功!",
					callback:function(){
						$rootScope.categorys.splice($rootScope.categorys.indexOf(item), 1);
					}
				});
			}
		}).catch(function(){
			
		});
	}
	$scope.add=function(){				//保存分类
		console.log($scope.category);
		categoryService.add({category:$scope.category}).then(function(res){
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
			}
		}).catch(function(){
			
		});
	}	
	$scope.update=function(){			//更新分类
		alert('update');
	}
	
	
	
}]);