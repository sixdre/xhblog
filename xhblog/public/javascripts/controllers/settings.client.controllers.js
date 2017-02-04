angular.module('webapp').controller('settingCtrl',['$scope','$http','$window','toaster','settingServices',function($scope,$http,$window,toaster,settingServices){

	$scope.submit=function(){
		var formData = new FormData($("#banner_form")[0]);
		settingServices.submit(formData).then(function(res){
			var data=res.data;
			if(data.code>0){
				toaster.pop({
					type: 'success',
	                title: 'Title text',
	                positionClass: "toast-top-center",
	                body: '提交成功',
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

	
	
}])

