angular.module('app').factory('alertService',['$http','$q',function($http,$q){
	
	return {
		confirm:function(){
			return  swal({
					   	  title: 'Are you sure?',
					   	  type: 'warning',
					   	  showCancelButton: true,
					   	  confirmButtonText: 'Yes',
					   	  cancelButtonText: 'No'
			 		})
		},
		success:function(title){
			return swal({
				  title: title||'Deleted!',
				  type: 'success',
				  timer: 2000
				}).then(
				  function () {},
				  // handling the promise rejection
				  function (dismiss) {
				    if (dismiss === 'timer') {
				      console.log('I was closed by the timer')
				    }
				  }
				)
		},
		error:function(title){
			return swal({
				  title: title||'出错了!',
				  type: 'error',
				  timer: 2000
				}).then(
				  function () {},
				  // handling the promise rejection
				  function (dismiss) {
				    if (dismiss === 'timer') {
				      console.log('I was closed by the timer')
				    }
				  }
				)
		 }
	};
	
}])