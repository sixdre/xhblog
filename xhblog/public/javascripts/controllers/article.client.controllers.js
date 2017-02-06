angular.module('webapp').controller('articleCtrl',['$scope','$http','$window','toaster','articleServices',function($scope,$http,$window,toaster,articleServices){
	

	
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
		articleServices.remove(id).then(function(data){
			console.log(data)
		},function(err){
			
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
				toaster.pop({
					type: 'success',
	                title: 'Title text',
	                positionClass: "toast-top-center",
	                body: '发表成功',
	                showCloseButton: true,
	                timeout:1000,
	                onHideCallback: function () { 
		              $window.location.reload();
		            }
				});
			}
		},function(err){
			
		})
	};

	$scope.search=function(title){
		if(!title){
			//toaster.pop('success', "title", "text");
			toaster.pop({
				type: 'error',
                title: 'Title text',
                positionClass: "toast-top-center",
                body: '请输入要搜索文章的标题',
                showCloseButton: true,
                timeout:1000,
			});

			//return alert('请输入要搜索文章的标题');
		}
		articleServices.search(title).then(function(doc){
			var data=doc.data.results;
			$scope.searchResult=data;
		},function(err){
			
		})
	}
	
	$scope.loadlist();
	
	
}]).controller('editorCtrl',['$scope',function($scope){
	if (uetrue) {
		uetrue.destroy();
	}
	uetrue=UE.getEditor('editor');
}]);

