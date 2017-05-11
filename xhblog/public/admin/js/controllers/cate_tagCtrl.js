angular.module('app')
	.controller('CateTagCtrl',
			['$rootScope','$scope','$timeout','$window','defPopService',
			'alertService','catetagService','toolService','DataService',
   function($rootScope,$scope,$timeout,$window,defPopService,alertService,catetagService,toolService,DataService){
	
	
	$scope.iscNew=true;   //判断类型是更新还是添加
	$scope.istNew=true;   //判断标签是更新还是添加

	//获取类型列表
	function getCategorys(){
		catetagService.category.list().then(function(res){
			if(res.data.code==1){
				DataService.Categorys=res.data.categorys;
			}else{
				alert('获取类型失败')
			}
		}).catch(function(){
			
		});
	}
	getCategorys();
	//获取类型列表
	function getTags(){
		catetagService.tag.list().then(function(res){
			if(res.data.code==1){
				DataService.Tags=res.data.tags;
			}else{
				alert('获取标签失败')
			}
		}).catch(function(){
			
		})
	}
	getTags();
	

	
	//修改
	$scope.revise=function(type,data){
		var data=angular.copy(data);		//用copy可解决数据修改同时列表数据发生改变问题
		if(type=="category"){
			$scope.category=data;
			$scope.iscNew=false;
		}else if(type="tag"){
			$scope.tag=data;
			$scope.istNew=false;
		}
	}
	
	//分类和标签的删除
//	$scope.remove=function(type,item){			
//		if(type=="category"){				//删除分类
//			alertService.confirm().then(function(){
//				catetagService.category.remove(item._id).then(function(res){
//					if(res.data.code==1){
//						alertService.success();
//						DataService.Categorys.splice(DataService.Categorys.indexOf(item), 1);
//					}
//				}).catch(function(){
//					
//				});
//			},function(){
//				
//			})
//		}else if(type="tag"){				//删除标签
//			alertService.confirm().then(function(){
//				catetagService.tag.remove(item._id).then(function(res){
//					if(res.data.code==1){
//						alertService.success();
//						DataService.Tags.splice(DataService.Tags.indexOf(item), 1);
//					}
//				}).catch(function(){
//					
//				});
//			},function(){
//				
//			})
//		}					
//	}
	
	//添加分类
	$scope.addCategory=function(){
		catetagService.category.add($scope.category).then(function(res){
			if(res.data.code==-1){
				defPopService.defPop({
					status:0,
					content:"已有此类型，不可重复添加"
				});
			}else if(res.data.code==1){
				defPopService.defPop({
					status:1,
					content:res.data.message,
					callback:function(){
						DataService.Categorys.push(res.data.category);
						$scope.category={};
					}
				});
			}
		}).catch(function(){
			defPopService.defPop({
				status:0,
				content:'服务器错误'
			});
		});
	}
	//更新分类
	$scope.updateCategory=function(){
		catetagService.category.update($scope.category).then(function(res){
			if(res.data.code==-1){
				defPopService.defPop({
					status:0,
					content:"已有此类型，不可重复添加"
				});
			}else if(res.data.code==1){
				defPopService.defPop({
					status:1,
					content:res.data.message,
					callback:function(){
						$scope.iscNew=true;
						getCategorys();
						$scope.category={};
					}
				});
			}
		}).catch(function(){
			defPopService.defPop({
				status:0,
				content:'服务器错误'
			});
		});
	}
	//删除分类
	$scope.removeCategory=function(item){
		alertService.confirm().then(function(){
			catetagService.category.remove(item._id).then(function(res){
				if(res.data.code==1){
					alertService.success('删除成功');
					DataService.Categorys.splice(DataService.Categorys.indexOf(item), 1);
				}
			}).catch(function(){
				defPopService.defPop({
					status:0,
					content:'服务器错误'
				});
			});
		});
	}
	
	
	
	//添加标签
	$scope.addTag=function(){
		catetagService.tag.add($scope.tag).then(function(res){
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
						DataService.Tags.push(res.data.tag);
						$scope.tag={};
					}
				});
			}
		}).catch(function(){
			defPopService.defPop({
				status:0,
				content:'服务器错误'
			});
		});
	}
	
	//更新标签
	$scope.updateTag=function(){
		catetagService.tag.update($scope.tag).then(function(res){
			if(res.data.code==-1){
				defPopService.defPop({
					status:0,
					content:"已有此类型，不可重复添加"
				});
			}else if(res.data.code==1){
				defPopService.defPop({
					status:1,
					content:"更新成功",
					callback:function(){
						$scope.istNew=true;
						getTags();
						$scope.tag={};
					}
				});
			}
		}).catch(function(){
			defPopService.defPop({
				status:0,
				content:'服务器错误'
			});
		});
	}
	//删除标签
	$scope.removeTag=function(item){
		alertService.confirm().then(function(){
			catetagService.tag.remove(item._id).then(function(res){
				if(res.data.code==1){
					alertService.success('删除成功');
					DataService.Tags.splice(DataService.Tags.indexOf(item), 1);
				}
			}).catch(function(){
				defPopService.defPop({
					status:0,
					content:'服务器错误'
				});
			});
		});
	}
	
	
	//分类或者标签的保存
//	$scope.add=function(type){				//保存分类
//		if(type=="category"){
//			catetagService.category.add($scope.category).then(function(res){
//				if(res.data.code==-1){
//					defPopService.defPop({
//						status:0,
//						content:"已有此类型，不可重复添加"
//					});
//				}else if(res.data.code==1){
//					defPopService.defPop({
//						status:1,
//						content:"添加成功",
//						callback:function(){
//							DataService.Categorys.push(res.data.category);
//							$scope.category={};
//						}
//					});
//				}else if(res.data.code==2){
//					defPopService.defPop({
//						status:1,
//						content:"修改成功",
//						callback:function(){
//							$scope.iscNew=true;
//							getCategorys();
//							$scope.category={};
//						}
//					});
//				}
//			}).catch(function(){
//				
//			});
//		}else if(type=="tag"){				//保存标签
//			catetagService.tag.add($scope.tag).then(function(res){
//				if(res.data.code==-1){
//					defPopService.defPop({
//						status:0,
//						content:"已有此类型，不可重复添加"
//					});
//				}else if(res.data.code==1){
//					defPopService.defPop({
//						status:1,
//						content:"添加成功",
//						callback:function(){
//							DataService.Tags.push(res.data.tag);
//							$scope.tag={};
//						}
//					});
//				}else if(res.data.code==2){
//					defPopService.defPop({
//						status:1,
//						content:"修改成功",
//						callback:function(){
//							$scope.istNew=true;
//							$scope.tag={};
//							getTags();
//						}
//					});
//				}
//			}).catch(function(){
//				
//			});
//		}
//	}	

	
	//取消
	$scope.cancel=function(type){
		if(type=="category"){
			$scope.iscNew = true;  
            $scope.category={};
//			 $timeout(function(){  
//              $scope.iscNew = true;  
//              $scope.category={};
//              $scope.$apply();
//          },10);  
		}else if(type=="tag"){
			$scope.istNew=true;
			$scope.tag={};
		}
	}
	
	
	
	
	
}]);