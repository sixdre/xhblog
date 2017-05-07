angular.module('app').controller('userCtrl',
		['$scope','defPopService','alertService','userService',
		 	function($scope,defPopService,alertService,userService){
		 		
		 		
	$scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [2, 5, 10],
        pageSize: 2,
        currentPage: 1
    };  
	/*
	 * getUsers 获取用户
	 */
	function getUsers(){
		userService.getUsers().then(function(res){
			$scope.Users=res.data.users;
			$scope.totalServerItems=res.data.users.length;
		}).catch(function(err){
			
		})
	}
	getUsers();
	
	$scope.gridOptions = {
        data: 'Users',
//      headerTemplate:'/admin/tpl/blocks/table_header.html',
        columnDefs: [{ field: 'username', 
             displayName: '名字', 
//           width: '10%', 
             enableColumnMenu: false,// 是否显示列头部菜单按钮
//           enableHiding: false,
//           suppressRemoveSort: true,
//           enableCellEdit: false // 是否可编辑
         	},
         	{ 	field: "email",displayName:'邮箱',enableColumnMenu: false},
         	{ 	field: "create_time",
	         	displayName:'注册时间', 
	         	enableColumnMenu: false,
	         	cellTemplate : '<div class="ui-grid-cell-contents">{{row.entity.create_time|date:"yyyy-MM-dd HH:mm:ss"}}</div>',
//	         	cellClass:'ui-grid-cell-contents'
        }],
        onRegisterApi : function (gridApi) {  
            $scope.gridApi = gridApi;  
            $scope.gridApi.edit.on.afterCellEdit($scope,function(rowEntity){  
                //编辑离开事件  
            });  
              
            $scope.gridApi.selection.on.rowSelectionChanged($scope,function(row,event){  
               //行选中事件  
               console.log('ssc')
             });  
        },  
        
        enablePagination: true,
        showFooter: true,
        totalItems: 'totalServerItems',
        paginationPageSizes: [10, 15, 20], //每页显示个数可选项
        paginationCurrentPage:1, //当前页码
        paginationPageSize: 2, //每页显示个数
		enableRowHeaderSelection : true, //是否显示选中checkbox框 ,default为true 
        enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
        enableVerticalScrollbar : 1, //grid垂直滚动条是否显示, 0-不显示  1-显示
    };
	
	
	
}])

