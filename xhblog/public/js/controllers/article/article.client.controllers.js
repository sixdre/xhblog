

angular.module('app').controller('articleCtrl',
		['$scope','$http','$window','$log','$modal','toaster','articleServices',"defPopService",
		 function($scope,$http,$window,$log,$modal,toaster,articleServices,defPopService){

	 $scope.maxSize = 5;	//
	 $scope.limit=5;		//每页显示的文章数
     $scope.bigTotalItems =0;
     $scope.bigCurrentPage = 1;
    
      //分页显示
	 $scope.pageChanged = function() {
    	 articleServices.page({current:$scope.bigCurrentPage,textCount:$scope.limit}).then(function(res){
    		 $scope.articlelist=res.data.page;
    	 },function(err){
    		 defPopService.defPop(0,"出错了！");
 		 })
	 };	
	

	//列表显示
	$scope.loadlist=function(){
		articleServices.list('').then(function(res){
			$scope.articlelist=res.data.article;
			$scope.bigTotalItems =res.data.article.length;
		},function(err){
			defPopService.defPop(0,"出错了！");
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
				defPopService.defPop(1,"删除成功!");
			}
		},function(err){
			defPopService.defPop(0,"服务器出错了！");
		});
	};
	$scope.save=function(){
		var formData = new FormData($("#Article_form")[0]);
		formData.append('author',$('#manager_name').text().trim());
		formData.append('content',UE.getEditor('editor').getContentTxt());
		formData.append('tagcontent',UE.getEditor('editor').getContent());
		articleServices.save(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				defPopService.defPop(1,"发表成功!");
			}
		},function(err){
			defPopService.defPop(0,"服务器出错了！");
		});
	};

	$scope.search=function(title){
		if(!title){
			return defPopService.defPop(0,"请输入要搜索文章的标题!");
		}
		articleServices.search(title).then(function(res){
			if(res.data.code<0){
				return defPopService.defPop(0,"没有找到相关文章！","搜索结果");
			}
			var data=res.data.results;
			$scope.searchResult=data;
			$scope.number=res.data.number;
		},function(err){
			defPopService.defPop(0,"服务器出错了！");
		});
	};
	
	//编辑文章
	$scope.items = ['item1', 'item2', 'item3'];
	$scope.edit=function(item){
		$scope.id=item.bId;
		/*articleServices.find(id).then(function(res){
			$scope.findarticleresult=res.data.article;
			 console.log($scope.findarticleresult);
		},function(err){
			defPop(0,"服务器出错了！");
		});*/
       var modalInstance = $modal.open({
          templateUrl: '/tpl/admin_tpl/article/editor_modal.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
        	  id:function(){		//注入到ModalInstanceCtrl 里的id
        		  return $scope.id;
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

}]);
angular.module('app').controller('ModalInstanceCtrl',
	['$scope', '$modalInstance',"id","articleServices","defPopService",
	 function($scope,$modalInstance,id,articleServices,defPopService){
		var id=id;
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
			defPopService.defPop(0,"服务器出错了！");
		});
		
		
	    /*$scope.selected = {
	      item: $scope.items[0]
	    };*/

	    $scope.update = function (id) {
	    	var arg={
	    		id:id,
	    		tagcontent:UE.getEditor('up_editor').getContent(),
	    		content:UE.getEditor('up_editor').getContentTxt()
	    	};
	    	articleServices.update(arg).then(function(res){
	    		var data=res.data;
	    		if(data.code>0){
	    			defPopService.defPop(1,"更新成功！");
	    		}
	    	},function(err){
	    		defPopService.defPop(0,"更新失败！");
	    	});
	    	
	    };

	    $scope.cancel = function () {
	      $modalInstance.dismiss('cancel');
	    };
}])





