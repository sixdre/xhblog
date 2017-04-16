angular.module('app').constant('AUTH_EVENTS', {
	loginSuccess: 'login-success',
	loginFailed: 'login-failed',
	logoutSuccess: 'logout-success',
	sessionTimeout: 'session-timeout',
	notAuthenticated: 'not-authenticated',
	notAuthorized: 'not-authorized'
})
.constant('USER', {
	user_name: "USER_NAME", //存储到cookie中的登录用户用户名
	user_id: "USER_ID", //存储到cookie中的登录用户id键值
})