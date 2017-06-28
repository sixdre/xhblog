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
    'ui.select',
    'ui.load',
    'ui.jq',
    'ui.grid',
    'ui.grid.selection',
    'ui.grid.edit',
    'ui.grid.exporter',
    'ui.grid.autoResize',
    'ui.grid.pagination',
    'ui.validate',
    'oc.lazyLoad',
    'ngFileUpload',
    //'pascalprecht.translate',
    "toaster",
   /* "textAngular"*/
]).run(['$rootScope', '$window', '$cookies', '$cookieStore', '$state', '$stateParams','USER',
	function($rootScope, $window, $cookies, $cookieStore, $state, $stateParams,USER) {
		
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
			$state.go("access.signin"); //跳转到登录界面
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

}]).config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$httpProvider",
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
}])

//请求拦截器 每当有请求发生，更新cookies失效时间
.factory('authInterceptor',['$rootScope','$cookies','USER','AUTH_EVENTS',function($rootScope, $cookies,USER,AUTH_EVENTS) {
	return {
		request: function(config) {
			var username = $cookies.get(USER.user_name);
            if (config.url.indexOf('admin_login')>-1||config.url.indexOf('admin_regist')>-1 || config.url.indexOf('.html')>-1) {
             	return config;
            }
            //用户身份标识
            if(username){
                  //刷新cookie 失效时间
                  var expireDate = new Date();
                  expireDate.setMinutes(expireDate.getMinutes()+10);
                  $cookies.put(USER.user_name, username,{'expires': expireDate});
                  return config;
            }else {
            	$rootScope.$broadcast(AUTH_EVENTS.notAuthorized,'请重新登录');
              	return $q.reject('not login');
            }
			return config;
		},
		response:function(response){
			return response;
		},
		responseError: function(response) {
			$rootScope.$broadcast({
			        401: AUTH_EVENTS.notAuthenticated,	//session失效
			        403: AUTH_EVENTS.notAuthorized,
			        419: AUTH_EVENTS.sessionTimeout,
			        440: AUTH_EVENTS.sessionTimeout
			    }[response.status], response.data.message);
			return $q.reject(response);
		}
	};
}])