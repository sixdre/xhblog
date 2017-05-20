//封装toaster 服务
angular.module('app').factory('defPopService',["$window","toaster",function($window,toaster){
	var factory={};
	/*defPop 封装弹框
	 * @params arg=0 表示错误弹框
	 * @params arg=1 表示成功弹框
	 * */
	factory.defPop=function(obj){
		if(obj.status==1){
			toaster.pop({
				type: 'success',
	            title:  obj.title||'Success',
	            positionClass: "toast-top-center",
	            body: obj.content,
	            showCloseButton: true,
	            timeout:800,
	            onHideCallback: obj.callback
			});
		}else if(obj.status==0){
			toaster.pop({
				type: 'error',
	            title: obj.title||'Error',
	            positionClass: "toast-top-center",
	            body:obj.content,
	            showCloseButton: true,
	            timeout:1000,
	            onHideCallback: obj.callback
			});
		}
	}

	return factory;
}]);