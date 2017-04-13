'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl',['$rootScope','$scope','$localStorage','$window',"$http","$state","$uibModal",
    function($rootScope,$scope,$localStorage,$window,$http,$state,$uibModal) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');
      
      
      $http({				//向后台请求主页面要展示的数据（文章总数，未读留言）
    	  method:"GET",
    	  url:"/admin/loadData"
      }).then(function(res){
    	  $rootScope.articleTotal=res.data.total;
    	  $rootScope.lm=res.data.lmdoc;
    	  console.log(res.data.lmdoc);
    	  $rootScope.manager=res.data.manager;
    	  $rootScope.categorys=res.data.categorys;
    	  $rootScope.tags=res.data.tags;
	  }).catch(function(err){
		 
	  })
      
      //退出登录
    $scope.logout=function(){
		  $http({
			  method:"POST",
			  url:"/admin/logout"
		  }).then(function(res){
			  if(res.data.code==1){
				  $state.go("access.signin");
			  }
		  },function(err){
			  
		  })
	  }
     
     //留言回复
	  $scope.reply=function(item){
	  	$uibModal.open({
	        templateUrl: '/admin/tpl/modal/wordModal.html',
	        size:'md',
	        controller: 'WordModalInstanceCtrl',
	        resolve: {
	        	wordItem:function(){
	        		return item;
	        	}
	        }
	    }).result.then(function(data){
	    	if(data.code==1){
	    		//http://blog.csdn.net/u013415189/article/details/51451431
	    	console.log(x);
	    	}
	    }).catch(function(){
	    	console.log(2);
	    })
	  }
      
      
      
      // config
      $scope.app = {
        name: 'Blog',
        version: '1.3.3',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
     /* $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };*/

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }]);
  
/*
 * 模态框
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
				  url:"/admin/word",
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