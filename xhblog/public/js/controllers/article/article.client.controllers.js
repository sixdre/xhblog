angular.module('app').controller('articleCtrl',['$scope','$http','$window','toaster','articleServices',function($scope,$http,$window,toaster,articleServices){

	/*defPop 封装弹框
	 * @params arg=0 表示错误弹框
	 * @params arg=1 表示成功弹框
	 * */
	function defPop(arg,content){
		if(arg==1){
			toaster.pop({
				type: 'success',
	            title: 'Title text',
	            positionClass: "toast-top-center",
	            body: content,
	            showCloseButton: true,
	            timeout:200,
	            onHideCallback: function () { 
	              $window.location.reload();
	            }
			});
		}else if(arg==0){
			toaster.pop({
				type: 'err',
	            title: 'Title text',
	            positionClass: "toast-top-center",
	            body: content,
	            showCloseButton: true,
	            timeout:1000,
			});
		}
	}
	
	
	$scope.loadlist=function(){
		
		articleServices.list('').then(function(data){
			$scope.articlelist=data.data.article;
		},function(data){
			alert('出错了')
		})
	};
	
	$scope.format=function(arg){
		return moment(arg).format('YYYY-MM-DD HH:mm:ss')
	};
	$scope.remove=function(item){
		var id = item.bId;
		articleServices.remove(id).then(function(res){
			var data=res.data;
			if(data.code>0){
				defPop(1,"删除成功!");
			}
		},function(err){
			defPop(0,"服务器出错了！");
		})
	};
	$scope.save=function(){
		var formData = new FormData($("#Article_form")[0]);
		formData.append('author',$('#manager_name').text().trim());
		formData.append('content',UE.getEditor('editor').getContentTxt());
		formData.append('tagcontent',UE.getEditor('editor').getContent());
		articleServices.save(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				defPop(1,"发表成功!");
			}
		},function(err){
			defPop(0,"服务器出错了！");
		})
	};

	$scope.search=function(title){
		if(!title){
			defPop(0,"请输入要搜索文章的标题!");
		}
		articleServices.search(title).then(function(res){
			var data=res.data.results;
			$scope.searchResult=data;
			$scope.number=res.data.number;
		},function(err){
			defPop(0,"服务器出错了！");
		})
	}
	
	$scope.loadlist();
	
	
}]);

