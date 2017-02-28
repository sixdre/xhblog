var uetrue=null;
angular.module('app').controller('editorCtrl',['$scope',function($scope){
	if (uetrue) {
		uetrue.destroy();
	}
	uetrue=UE.getEditor('editor',{
        initialFrameHeight:300		//高度设置
    });
	
}]);