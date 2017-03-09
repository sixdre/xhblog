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
	
	
	
	
	
	$scope.remove=function(){			//删除分类
		alert('remove');
	}
	$scope.add=function(){				//保存分类
		console.log($scope.category);
		categoryService.add({category:$scope.category}).then(function(res){
			console.log(res.data);
		}).catch(function(){
			
		});
	}	
	$scope.update=function(){			//更新分类
		alert('update');
	}
	
	
	
}]);