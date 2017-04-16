'use strict';
angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    //'pascalprecht.translate',
    "toaster",
   /* "textAngular"*/
]).run(function($rootScope, $window, $cookies, $cookieStore, $state, $stateParams,USER) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		//如果跳到登录页面直接放行
		if(toState.name == 'access.signin' || toState.name == 'access.signup') {
			return;
		}
		var username=$cookies.get(USER.user_name); //用户身份
		if(!username){					//cookies 没有找到用户
			event.preventDefault(); // 取消默认跳转行为
			//记录被拦截的页面信息 当登录后再调至该页面
			//失效时间
			var expireDate = new Date();
			expireDate.setMinutes(expireDate.getMinutes() + 10);
			$cookies.put('rejectState', toState, { 'expires': expireDate });
			$cookies.put('rejectParams', toParams, { 'expires': expireDate });
			$state.go("access.signin", { w: 'notLogin' }); //跳转到登录界面
			return;
		}else{
			//刷新cookie 失效时间
			var expireDate = new Date();
			expireDate.setMinutes(expireDate.getMinutes() + 10 * 6); //一小时
			$cookies.put(USER.user_name, username, { 'expires': expireDate });
		}
	});

	//state 跳转成功 将被拦截的state从cookie中移除
	$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
		if(to.name != 'access.signin') {
			$cookieStore.remove('rejectState');
			$cookieStore.remove('rejectParams');
		}
	});

}).config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
}])
//请求拦截器 每当有请求发生，更新cookies失效时间
//.factory('cookiesRefreshInterceptor', ['$q', '$cookies', '$rootScope',
//	function($q, $cookies,$rootScope,) {
//		console.log(123);
//  var cookiesRefreshInterceptor = {
//      request: function(config) {
//          if (config.url.indexOf('login')>-1) {
//            return config;
//          };
//          //用户身份标识
//          var uid = $cookies.get("LOGIN_USER_ID");
//          if(uid){
//                //刷新cookie 失效时间
//                var expireDate = new Date();
//                expireDate.setMinutes(expireDate.getMinutes()+10);
//                $cookies.put('LOGIN_USER_ID' , uid,{'expires': expireDate});
//                return config;
//          }else{
//            
//            
//            return $q.reject('not login');
//          }
//
//      }
//  };
//	console.log(cookiesRefreshInterceptor)
//  return cookiesRefreshInterceptor;
//}]);

.factory('authInterceptor', function($rootScope, $cookies) {
	return {
		request: function(config) {
			
			return config;
		},
		response:function(response){
			return response;
		},
		responseError: function(response) {
			// ...
		}
	};
})