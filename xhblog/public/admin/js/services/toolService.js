/*
 * 工具服务
 * 
 */
angular.module('app')
	.factory('toolService',["$http","$q","$cookies",function($http,$q,$cookies){
		
		return {
			/*
			 * addSelect 复选框选中
			 * @params arr 要添加进的数组
			 * @params item  要添加的元素
			 */
			addSelect:function(arr,item){				
				var len=arr.length+1;
			    for(var i=0;i<len;i++){
				    if(item == arr[i]){
				        arr.splice(i,1);
				        return;
				    }
			    };
			   arr.push(item);
			}
		};
}])
