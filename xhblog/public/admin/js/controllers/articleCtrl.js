"use strict";
var uetrue=null;
/*
 * 文章发布控制器
 */
app.controller('articlePublishCtrl',
		['$rootScope','$scope',"$stateParams",'Upload','articleService',"defPopService","alertService",'DataService',
		 function($rootScope,$scope,$stateParams,Upload,articleService,defPopService,alertService,DataService){
		 	

			$scope.clearArticle=function(){		//注在请求中不要调用此方法,angular会自动脏数据检查
				$scope.$apply(function(){
					$scope.article={};
				});
			}
			$scope.article={};
			
			$scope.publish=function(state){
				var article={
					title:$scope.article.title,
					category:$scope.article.category,
					tags:$scope.article.tags,
					content:UE.getEditor('editor').getContentTxt(),
					tagcontent:UE.getEditor('editor').getContent()
				}
				if(article.content.trim().length==0){
					return defPopService.defPop({
							status:0,
							content:"请输入文章内容！"
						});
				}
				if(state&&state=="draft"){			//存为草稿
					article.isDraft=true;		//为草稿
					article.isActive=false;		//无效
				}
				Upload.upload({
	            url: '/api/admin/article/publish',
	            file:$scope.file,
	            data:article,
//	            fileFormDataName:'cover'
	         }).then(function (res) {
	           if(res.data.code>0){
						alertService.success('发表成功!');
						DataService.ArticleTotal+=1;
						$scope.article={};
					}
	         }, function (resp) {
	            defPopService.defPop({
						status:0,
						content:"出错了！"
					});
	         }, function (evt) {
	            console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :'+ evt.config.file.name);
	         });
			}
			//文章发表
//			$scope.publish=function(state){
//				if($scope.article.tags.length>3){
//		    		return defPopService.defPop({
//		    			status:0,
//						content:"标签最多只能添加3个！"
//		    		})
//		    	}
//				var article={
//					title:$scope.article.title,
//					category:$scope.article.category,
//					tags:$scope.article.tags,
//					content:UE.getEditor('editor').getContentTxt(),
//					tagcontent:UE.getEditor('editor').getContent()
//				}
//				if(article.content.trim().length==0){
//					return defPopService.defPop({
//							status:0,
//							content:"请输入文章内容！"
//						});
//				}
//				if(state&&state=="draft"){			//存为草稿
//					article.isDraft=true;		//为草稿
//					article.isActive=false;		//无效
//				}
//				articleService.publish(article).then(function(res){
//					if(res.data.code>0){
//						alertService.success('发表成功!');
//						DataService.ArticleTotal+=1;
//						$scope.article={};
//					}
//				}).catch(function(err){
//					 defPopService.defPop({
//						status:0,
//						content:"出错了！"
//					 });
//				});
//			}
			
}])

/*
 * 文章列表管理控制器
 */
app.controller('articleListCtrl',
		['$rootScope','$scope',"$stateParams",
		 "$http",'$log','$uibModal','articleService',
		 "defPopService","alertService","toolService",'DataService',
		 function($rootScope,$scope,$stateParams,
				 $http,$log,$uibModal,articleService,
				 defPopService,alertService,toolService,DataService){
			
	var currentPage=$stateParams.page;
	if(currentPage==""){
		currentPage=1;
	}else{
		currentPage=parseInt(currentPage);
	}
		
			//分页配置参数
	$scope.pageConfig = {
		maxSize:5,					//分页页数
		limit:5,					//每页显示的文章数
 		pageSizes:[5,10,20],		//每页显示的文章数量下拉列表
		totalItems:DataService.ArticleTotal,		//文章总数
        currentPage:currentPage,		//当前页
    };
	$scope.checkedIds = [];		//id组用来存放选中的文章id
	
	

	  //分页显示
	 $scope.pageChanged = function() {
	 	
		 var cp=$scope.pageConfig.currentPage,
		 	limit=$scope.pageConfig.limit;
    	 articleService.page({current:cp,textCount:limit}).then(function(res){
    		 $scope.articleList=res.data.results;			//文章列表
    		 DataService.ArticleTotal=res.data.total;		//文章总数
    		 $scope.StartNum=($scope.pageConfig.currentPage-1)*$scope.pageConfig.limit+1;
    		 var End=$scope.pageConfig.currentPage*$scope.pageConfig.limit;
    		 $scope.EndNum=End<DataService.ArticleTotal?End:DataService.ArticleTotal;
    		
    	 }).catch(function(err){
    		 defPopService.defPop({
					status:0,
					content:"出错了！"
			 });
 		 })
	};	
	//初始化
	$scope.pageChanged();
	 
	//检测文章列表数据
	$scope.$watch('articleList',function(newVal,oldVal){
	 	if(newVal!==oldVal){
	 		$scope.select_all=false;
	 		$scope.checkedIds = [];
	 	}
	})
	 
	//检测下拉文章列表数
	$scope.$watch('pageConfig.limit',function(newVal,oldVal){
		if(newVal!==oldVal){
			$scope.pageChanged();
		}
	})
	 
	 
	//文章全选操作
	$scope.selectAll=function(allCheck){
		if(allCheck==true){			//全选
			angular.forEach($scope.articleList,function (value) {
				if($scope.checkedIds.indexOf(value._id)==-1){
					$scope.checkedIds.push(value._id);
				}
            });
		}else{			//取消全选
			$scope.checkedIds=[];
		}
	}
	//单选
	$scope.selectOne = function (id) {
		toolService.addSelect($scope.checkedIds,id);
    }
    
	$scope.removeMulti=function(){				//多选或单选删除
		if($scope.checkedIds.length==0){
			return defPopService.defPop({
					status:0,
					content:"请选择要删除的文章！"
			 });
		}
		alertService.confirm().then(function(){
			articleService.removeMulti($scope.checkedIds).then(function(res){
				if(res.data.code>0){
					alertService.success('删除成功');
					$scope.pageChanged();
				}
			}).catch(function(err){
				alertService.error('删除失败,服务器错误');
			});
		},function(){
			$scope.$apply(function(){
				$scope.select_all=false;
				$scope.checkedIds = [];
			})
		})
	}
	
	$scope.removeOne=function(id){				//图标点击删除 单个删除
		alertService.confirm().then(function(){
			articleService.removeOne(id).then(function(res){
				if(res.data.code==1){
					alertService.success(res.data.message);
					$scope.pageChanged();
				}
			}).catch(function(err){
				
			})
		}).catch(function(err){
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	
	//编辑文章
	$scope.edit=function(item){
        $uibModal.open({
            templateUrl: '/admin/tpl/article/editor_modal.html',
            size:'lg',
            controller: 'ModalInstanceCtrl',
            resolve: {
        	    data:function(){		//注入到ModalInstanceCtrl 里的data
	        		return {
	        		  	article:item
	        		};
        	    },
             }
        }).result.then(function(){
        	$scope.pageChanged();
        }).catch(function(){
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
	['$scope', '$uibModalInstance',"$timeout","articleService","defPopService","alertService",'DataService','data',
	 function($scope,$uibModalInstance,$timeout,articleService,defPopService,alertService,DataService,data){
	 	
	 	$scope.article=angular.copy(data.article);
	 	$scope.article.category=$scope.article.category._id;
		
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
	    	if($scope.article.tags.length>3){
	    		return defPopService.defPop({
	    			status:0,
					content:"标签最多只能添加3个！"
	    		})
	    	}
	    	var article=angular.copy($scope.article);
	    		article.isDraft=!$scope.isDraft;
	    		article.isActive=true;
	    		article.tagcontent=UE.getEditor('update_modal').getContent();
	    		article.content=UE.getEditor('update_modal').getContentTxt();
	    	articleService.update(article).then(function(res){
	    		if(res.data.code>0){
	    			alertService.success('更新成功').then(function(){
	    				$uibModalInstance.close();
	    			});
	    		}
	    	}).catch(function(err){
	    		alertService.error('更新失败!');
	    	});
	    	return false;
	    };

	    $scope.cancel = function () {
	       $uibModalInstance.dismiss('cancel');
	    };
	    
}])



