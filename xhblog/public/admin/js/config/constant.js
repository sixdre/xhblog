angular.module('app').constant('AUTH_EVENTS', {
	loginSuccess: 'login-success',
	loginFailed: 'login-failed',
	logoutSuccess: 'logout-success',
	sessionTimeout: 'session-timeout',
	notAuthenticated: 'not-authenticated',		//没有生效，不真实
	notAuthorized: 'not-authorized'			//没有授权
})
.constant('USER', {
	user_name: "USER_NAME", //存储到cookie中的登录用户用户名
	user_id: "USER_ID", //存储到cookie中的登录用户id键值
})