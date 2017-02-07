//alert 服务
angular.module('app').factory('defPopService',["$window","toaster",function($window,toaster){
	var factory={};
	/*defPop 封装弹框
	 * @params arg=0 表示错误弹框
	 * @params arg=1 表示成功弹框
	 * */
	factory.defPop=function(arg,content,title){
		if(arg==1){
			toaster.pop({
				type: 'success',
	            title:  title||'Title text',
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
	            title: title||'Title text',
	            positionClass: "toast-top-center",
	            body: content,
	            showCloseButton: true,
	            timeout:1000,
			});
		}
	}

	return factory;
}]);