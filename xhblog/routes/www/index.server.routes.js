var IndexCtrl = require('../../controller/www/index.server.controllers');

module.exports = function(app) {
	app.get('/',IndexCtrl.common,IndexCtrl.showIndex);
	app.get('/page/:page', IndexCtrl.showIndex);
	app.get('/detial/:bid',IndexCtrl.common,IndexCtrl.showDetial);
	app.get('/search',IndexCtrl.common,IndexCtrl.showSearchResults);			//搜索文章
	app.get('/login', IndexCtrl.showLogin);
	app.get('/regist',IndexCtrl.showRegist);
	app.get('/logout',IndexCtrl.logout);
	app.post('/doLogin', IndexCtrl.doLogin);						//登录
	app.post('/doRegist', IndexCtrl.doRegist);					//注册
	
	app.post('/comment',IndexCtrl.checkLogin,IndexCtrl.postComment);			//评论
	app.get('/word',IndexCtrl.common,IndexCtrl.showWord);		//留言
	app.post('/word',IndexCtrl.checkLogin,IndexCtrl.postWord);						//提交留言
	
	app.get('/about',IndexCtrl.about);		//关于我
	
	
	app.get('*', function (req, res) {					//其它未被注册的接口都跳转到404	可以被解析匹配的请求路径在各自对应的中间件中被一一处理并返回了结果，剩下所有能够到达最底层的请求则是无法被已有路由解析的，于是返回404。										
	    res.send(404, "Oops! We didn't find it");
	});
	//app.post('/detial:cc', Index.showDetial);
}