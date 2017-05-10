  
/*
 * 留言回复模态框
 */
app.controller('WordModalInstanceCtrl',
	['$scope','$http','$uibModalInstance','wordItem',
	 function($scope,$http,$uibModalInstance,wordItem){
	 	console.log(wordItem);
			$scope.word=wordItem;
			//回复提交
			$scope.postReply=function(){
				$http({
				  method:"POST",
				  url:"/api/word/reply",
				  data:{
				  	id:$scope.word._id,
				  	replyContent:$scope.replyContent
				  }
			  }).then(function(res){
			  	if(res.data.code==1){
			  		alert(res.data.message);
			  		$uibModalInstance.close({code:1});
			  	}
			  },function(err){
				  
			  })
			}
			
	    $scope.cancel = function () {
	       $uibModalInstance.dismiss('cancel');
	    };
	    
}])