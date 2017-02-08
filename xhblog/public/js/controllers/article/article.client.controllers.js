

angular.module('app').controller('articleCtrl',
		['$scope','$http','$window','$log','$modal','toaster','articleServices',"defPopService",
		 function($scope,$http,$window,$log,$modal,toaster,articleServices,defPopService){

	 $scope.maxSize = 5;	//
	 $scope.limit=5;		//每页显示的文章数
     $scope.bigTotalItems =0;
     $scope.bigCurrentPage = 1;
    
      //分页显示
	 $scope.pageChanged = function(cp,limit) {
    	 articleServices.page({current:cp,textCount:limit}).then(function(res){
    		 $scope.articlelist=res.data.page;
    		 angular.forEach($scope.articlelist,function(v){
    			 v.check=false;
    		 });
    		 
    	 },function(err){
    		 defPopService.defPop({
					status:0,
					content:"出错了！"
			 });
 		 })
	 };	
	
	 
	 $scope.checkedIds = [];		//id组
	 var str="";//
	 var flag='';//是否点击了全选，是为a
	 $scope.x=false;//默认未选中
	//文章全选操作
	$scope.selectAll=function(c,v){
		/*angular.forEach($scope.articlelist,function (v) {
			v.check=$scope.select_all;
			if($scope.checkedIds.indexOf(v.bId)<0){
				$scope.checkedIds.push(v.bId);
			}
        });*/
		$scope.item_checked=!$scope.item_checked;
		if(c==true){
			angular.forEach($scope.articlelist,function (v) {
				if($scope.checkedIds.indexOf(v.bId)<0){
					$scope.checkedIds.push(v.bId);
				}
            });
		}else{
			 angular.forEach($scope.articlelist,function (v) {
				$scope.checkedIds=[];
	         });
		}
		flag="a";
	}
	//单选
	$scope.selectOne = function (id) {
		/*var index = $scope.checkedIds.indexOf(item.bId);
		console.log($scope.checkedIds)
		console.log(index);*/
		var index = $scope.checkedIds.indexOf(id);
		if(index === -1) {					//如果没有那就添加到数组中
			 $scope.checkedIds.push(id);				
        } else if (index !== -1){			//否则就删除掉
            $scope.checkedIds.splice(index, 1);
        };
    }
    
	$scope.del=function(){
		
		 $http({
			method:"POST",
			url:"/admin/article/del",
			data:{ids:$scope.checkedIds}
		 }).then(function(res){
			console.log(res)
		 }).catch(function(err){
			console.log(err)
		 })
	}
	
	 
	 
	 
	 
	 
	 
	 

	//列表显示
	$scope.loadlist=function(){
		articleServices.list('').then(function(res){
			$scope.bigTotalItems =res.data.article.length;
		},function(err){
			 defPopService.defPop({
					status:1,
					content:"出错了！"
			 });
		});
	};
	
	
	
	
	

	$scope.format=function(arg){
		return moment(arg).format('YYYY-MM-DD HH:mm:ss');
	};
	$scope.remove=function(item){
		var id = item.bId;
		articleServices.remove(id).then(function(res){
			var data=res.data;
			if(data.code>0){
				 defPopService.defPop({
					status:1,
					content:"删除成功!",
					callback:function(){
						$scope.pageChanged();
					}
				 });
			}
		},function(err){
			 defPopService.defPop({
					status:0,
					content:"出错了！"
			 });
		});
	};
	
	//发布文章
	$scope.save=function(){
		var formData = new FormData($("#Article_form")[0]);
		formData.append('author',$('#manager_name').text().trim());
		formData.append('content',UE.getEditor('editor').getContentTxt());
		formData.append('tagcontent',UE.getEditor('editor').getContent());
		articleServices.save(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				defPopService.defPop({
					status:1,
					content:"发表成功!"
				 });
			}
		},function(err){
			 defPopService.defPop({
					status:0,
					content:"出错了！"
			 });
		});
	};
	
	//搜索文章
	$scope.search=function(title){
		if(!title){
			return defPopService.defPop({
					status:0,
					content:"请输入要搜索文章的标题！"
			 });
			
		}
		articleServices.search(title).then(function(res){
			if(res.data.code<0){
				return defPopService.defPop({
					status:0,
					title:"搜索结果",
					content:"请输入要搜索文章的标题！"
			    });
				
			}
			var data=res.data.results;
			$scope.searchResult=data;
			$scope.number=res.data.number;
		},function(err){
			defPopService.defPop({
				status:0,
				content:"服务器出错了！"
		    });
		});
	};
	
	//编辑文章
	$scope.edit=function(item){
		$scope.id=item.bId;
       var modalInstance = $modal.open({
          templateUrl: '/tpl/admin_tpl/article/editor_modal.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
        	  id:function(){		//注入到ModalInstanceCtrl 里的id
        		  return $scope.id;
        	  },
        	  pageChanged:function(){
        		
        	  }
          }
        });

       /* modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });*/
	};
	
	$scope.loadlist();
	$scope.pageChanged(1,5);

}]);
angular.module('app').controller('ModalInstanceCtrl',
	['$scope', '$modalInstance',"id","pageChanged","articleServices","defPopService",
	 function($scope,$modalInstance,id,pageChanged,articleServices,defPopService){
		var id=id;
		var pageChanged=pageChanged;
		articleServices.find(id).then(function(res){
			$scope.up_item=res.data.article;
			UE.delEditor("up_editor");		//先销毁在进行创建否则会报错
			var upUe=UE.getEditor('up_editor',{
		        initialFrameHeight:200		//高度设置
		    });;  
		    upUe.addListener("ready", function () {
		    	// editor准备好之后才可以使用
		    	upUe.setContent($scope.up_item.tagcontent);
	        });
		},function(err){
			defPopService.defPop({
				status:0,
				content:"服务器出错了！"
		    });
		});
		

	    $scope.update = function (id) {
	    	var arg={
	    		id:id,
	    		tagcontent:UE.getEditor('up_editor').getContent(),
	    		content:UE.getEditor('up_editor').getContentTxt()
	    	};
	    	articleServices.update(arg).then(function(res){
	    		var data=res.data;
	    		if(data.code>0){
	    			defPopService.defPop({
	    				status:1,
	    				content:"更新成功！"
	    		    });
	    			
	    		}
	    	},function(err){
	    		defPopService.defPop({
    				status:0,
    				content:"更新失败！"
    		    });
	    	
	    	});
	    	
	    };

	    $scope.cancel = function () {
	      $modalInstance.dismiss('cancel');
	    };
}])





