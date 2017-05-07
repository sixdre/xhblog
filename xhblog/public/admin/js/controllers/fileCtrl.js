angular.module('app').controller('fileCtrl',
		['$scope','Upload','defPopService','alertService','fileService',
		 	function($scope,Upload,defPopService,alertService,fileService){
		 		
	/*
	 * getAllFiles 获取所有文件列表
	 */
	function getAllFiles(){
		fileService.getAllFiles().then(function(res){
			$scope.files=res.data.files;
			console.log(res);
		}).catch(function(err){
			
		})
	}
	getAllFiles();
	
	$scope.uploadFile=function(){
		fileService.uploadFile($scope.file).then(function(res) {
			if(res.data.code==1){
				alertService.success(res.data.message);
			}else{
				alertService.error(res.data.message);
			}
			$scope.progress=0;
		}, function(resp) {
			defPopService.defPop({
				status: 0,
				content: "出错了！"
			});
		}, function(evt) {
			$scope.progress=parseInt(100.0 * evt.loaded / evt.total);
			console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :');
		});
	}
	
	
}])

