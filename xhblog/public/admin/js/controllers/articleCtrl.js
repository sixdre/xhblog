"use strict";
var uetrue=null;
/*
 * 文章发布控制器
 */
app.controller('articlePublishCtrl',
		['$rootScope','$scope',"$stateParams",'articleService',"defPopService","alertService",
		 function($rootScope,$scope,$stateParams,articleService,defPopService,alertService){
			
			$scope.clearArticle=function(){		//注在请求中不要调用此方法,angular会自动脏数据检查
				$scope.$apply(function(){
					$scope.article={};
				});
			}
			
			//文章发表
			$scope.publish=function(data){
				if(data=="draft"){	//存为草稿
					$scope.article.isDraft=true;		//为草稿
				}
				var tagArr=[];
				angular.forEach($scope.article.tags,function(tag){
					if(tag){
						tagArr.push(tag);
					}
				});
				$scope.article.tags=tagArr;
				$scope.article.tagcontent=UE.getEditor('editor').getContent();
				$scope.article.content=UE.getEditor('editor').getContentTxt();
				articleService.publish($scope.article).then(function(res){
					var data=res.data;
					console.log(res);
					if(data.code>0){
						alertService.success('发表成功!');
						$rootScope.articleTotal++;
						$scope.article={};
					}
				}).catch(function(err){
					 defPopService.defPop({
							status:0,
							content:"出错了！"
					 });
				});

				/*var formData = new FormData($("#Article_form")[0]);
				formData.append('author',$('#manager_name').text().trim());
				formData.append('content',UE.getEditor('editor').getContentTxt());
				formData.append('tagcontent',UE.getEditor('editor').getContent());
				formData.append("article_type",$scope.article.type.name);	//类型
				articleService.save(formData).then(function(res){
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
				});*/
			};
}])

/*
 * 文章列表管理控制器
 */
app.controller('articleListCtrl',
		['$rootScope','$scope',"$stateParams",
		 "$http",'$log','$uibModal','articleService',
		 "defPopService","alertService",
		 function($rootScope,$scope,$stateParams,
				 $http,$log,$uibModal,articleService,
				 defPopService,alertService){
			
	var currentPage=$stateParams.page;
	if(currentPage==""){
		currentPage=1;
	}else{
		currentPage=parseInt(currentPage);
	}
		
			//分页配置参数
	$scope.pageConfig = {
		maxSize:5,
		limit:5,		//每页显示的文章数
	    totalItems:$rootScope.articleTotal,	//文章总数
        currentPage:currentPage
    };
	$scope.checkedIds = [];		//id组用来存放选中的文章id
	
	  //分页显示
	 $scope.pageChanged = function() {
		 var cp=$scope.pageConfig.currentPage,
		 	limit=$scope.pageConfig.limit;
    	 articleService.page({current:cp,textCount:limit}).then(function(res){
    		 $scope.articlelist=res.data.results;
    		 $scope.listStart=($scope.pageConfig.currentPage-1)*$scope.pageConfig.limit+1;
    		 var listEnd=$scope.pageConfig.currentPage*$scope.pageConfig.limit;
    		 $scope.listEnd=listEnd<$rootScope.articleTotal?listEnd:$rootScope.articleTotal;
    		
    	 }).catch(function(err){
    		 defPopService.defPop({
					status:0,
					content:"出错了！"
			 });
 		 })
	};	
	$scope.pageChanged($scope.pageConfig.currentPage,$scope.pageConfig.limit)
	 
	 
	//文章全选操作
	$scope.selectAll=function(allCheck){
		if(allCheck==true){
			angular.forEach($scope.articlelist,function (v) {
				if($scope.checkedIds.indexOf(v.bId)<0){
					$scope.checkedIds.push(v.bId);
				}
            });
		}else{
			 //angular.forEach($scope.articlelist,function (v) {
				$scope.checkedIds=[];
	         //});
		}
	}
	//单选
	$scope.selectOne = function (id) {
		var index = $scope.checkedIds.indexOf(id);
		if(index === -1) {					//如果没有那就添加到数组中
			 $scope.checkedIds.push(id);				
        } else if (index !== -1){			//否则就删除掉
            $scope.checkedIds.splice(index, 1);
        };
    }
    
	$scope.removeMulti=function(){				//多选或单选删除
		if($scope.checkedIds.length==0){
			return defPopService.defPop({
					status:0,
					content:"请选择要删除的文章！"
			 });
		}
		alertService.confirm().then(function(){
			return articleService.removeMulti({ids:$scope.checkedIds})
		}).then(function(res){
			var data=res.data;
			if(data.code>0){
				alertService.success('删除成功');
				var total=($rootScope.articleTotal)-($scope.checkedIds.length);
				$rootScope.articleTotal=total<0?0:total;
				$scope.pageChanged();
			}
		}).catch(function(){
			$scope.checkedIds = [];
			$log.info('Modal dismissed at: ' + new Date());
		});
	}
	
	$scope.removeOne=function(item){				//图标点击删除 单个删除
		var bId=item.bId;
		alertService.confirm().then(function(){
			articleService.removeOne(bId).then(function(res){
				var data=res.data;
				if(data.code>0){
					alertService.success('删除成功');
					$rootScope.articleTotal=($rootScope.articleTotal)-1<0?0:($rootScope.articleTotal-1);
					$scope.pageChanged();
				}
			}).catch(function(err){
				console.log(1);
			})
		}).catch(function(){
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	
	//编辑文章
	$scope.edit=function(item){
		var article=item;
        $uibModal.open({
            templateUrl: '/admin/tpl/article/editor_modal.html',
            size:'lg',
            controller: 'ModalInstanceCtrl',
            resolve: {
        	    data:function(){		//注入到ModalInstanceCtrl 里的data
        		    var obj={
        			    article:article
        		    }
        		  return obj;
        	    },
             }
        }).result.then(function(){
        	$scope.pageChanged();
        }).catch(function(){
        	console.log(2);
        })

	};
	

}])

/*
 * 文章搜索控制器
 */
app.controller('articleSearchCtrl',
		['$rootScope','$scope','articleService',"defPopService",
		 function($rootScope,$scope,articleService,defPopService){
		$scope.search=function(title){
			if(!title){
				return defPopService.defPop({
						status:0,
						content:"请输入要搜索文章的标题！"
				 });
			}
			articleService.search(title).then(function(res){
				if(res.data.code<0){
					return defPopService.defPop({
						status:0,
						title:"搜索结果",
						content:"没有找到相关文章！"
				    });
				}
				var results=res.data.results;
				$scope.results=results;
				$scope.length=results.length;
			}).catch(function(err){
				defPopService.defPop({
					status:0,
					content:"服务器出错了！"
			    });
			});
		};
}])


/*
 * 模态框
 */
app.controller('ModalInstanceCtrl',
	['$scope', '$uibModalInstance',"$timeout","data","articleService","defPopService","alertService",
	 function($scope,$uibModalInstance,$timeout,data,articleService,defPopService,alertService){
		$scope.article=data.article;
	
		$scope.isSelected=function(id){				//检查当前文章的标签，并和所有标签对应是否选中
			return $scope.article.tags.indexOf(id)>=0;
		}
		var updateSelected = function(action,id){		
	        if(action == 'add' && $scope.article.tags.indexOf(id) == -1){
	        	$scope.article.tags.push(id);
	            
	        }
	        if(action == 'remove' && $scope.article.tags.indexOf(id)!=-1){
	            var idx = $scope.article.tags.indexOf(id);
	            $scope.article.tags.splice(idx,1);
	           
	        }
	    }
		$scope.updateSelection=function($event,id){		//checkbox点击更新或删除文章的标签数组
			 var checkbox = $event.target;
		     var action = (checkbox.checked?'add':'remove');
		     if(action == 'add' && $scope.article.tags.indexOf(id) == -1){
	        	$scope.article.tags.push(id);
	            
	         }
	         if(action == 'remove' && $scope.article.tags.indexOf(id)!=-1){
	            var idx = $scope.article.tags.indexOf(id);
	            $scope.article.tags.splice(idx,1);
	           
	         }
		}
		
		$timeout(function(){					//这里要用$timeout 否则报错
			UE.delEditor("update_modal");		//先销毁在进行创建否则会报错
			var upUe=UE.getEditor('update_modal',{
		        initialFrameHeight:200		//高度设置
		    });  
			upUe.addListener("ready", function () {
		    	// editor准备好之后才可以使用
		    	upUe.setContent($scope.article.tagcontent);
	        });
		},10);
		
		//文章更新
	    $scope.update = function () {
	    	console.log($scope.article);
	    	var article=$scope.article;
		    	article.tagcontent=UE.getEditor('update_modal').getContent();
		    	article.content=UE.getEditor('update_modal').getContentTxt();
	    	articleService.update(article).then(function(res){
	    		var data=res.data;
	    		if(data.code>0){
	    			alertService.success('更新成功').then(function(){
	    				 $uibModalInstance.close();
	    			});
	    		}
	    	}).catch(function(err){
	    		alertService.error('更新失败!');
	    	});
	    };

	    $scope.cancel = function () {
	       $uibModalInstance.dismiss('cancel');
	    };
	    
	    $scope.confirm=function(){
	        $uibModalInstance.close({			//里面的参数为向 modalInstance.result.then(function (e) {})中传递一个数据
	        	code:1						
	        });
	    }
}])









