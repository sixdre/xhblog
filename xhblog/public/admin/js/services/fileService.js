angular.module('app').factory('fileService',['$http','$q','Upload',function($http,$q,Upload){

	return {
		getAllFiles:function(){			//获取所有文件
			return $http.get('/api/allFiles')
		},
		uploadFile:function(file){
			return 	Upload.upload({			//上传文件
						url: '/api/upload/addFile',
						data: {
							file: file
						}
					})
		}
		
	}
	
}])