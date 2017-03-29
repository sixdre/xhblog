angular.module('app').controller('settingCtrl',
		['$scope','defPopService','alertService','settingService',
		 	function($scope,defPopService,alertService,settingService){
	
	/*
	 * addbanner 添加banner
	 */
	$scope.addbanner=function(){
		var formData = new FormData($("#banner_form")[0]);
		settingService.post_banner(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				alertService.success('添加成功!').then(function(){
					
				})
			}
		}).catch(function(err){
			
		})
	};
	
}])

