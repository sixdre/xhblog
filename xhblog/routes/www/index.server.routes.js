var IndexCtrl = require('../../controller/www/index.server.controllers');

module.exports = function(app) {
	app.get('/', IndexCtrl.showIndex);
	app.get('/page/:page', IndexCtrl.showIndex);
	app.get('/detial/:bid', IndexCtrl.showDetial);
	app.get('/search', IndexCtrl.showSearchResults);			//搜索文章
	app.get('/login', IndexCtrl.showLogin);
	app.get('/regist',IndexCtrl.showRegist);
	
	app.get('/doLogin', IndexCtrl.doLogin);						//登录
	app.post('/doRegist', IndexCtrl.doRegist);					//注册
	
	app.get('/word',IndexCtrl.showWord);		//留言
	app.post('/word',IndexCtrl.postWord);						//提交留言
	
	app.get('*', function (req, res) {					//其它未被注册的接口都跳转到404	可以被解析匹配的请求路径在各自对应的中间件中被一一处理并返回了结果，剩下所有能够到达最底层的请求则是无法被已有路由解析的，于是返回404。										
	    res.send(404, "Oops! We didn't find it");
	});
	//app.post('/detial:cc', Index.showDetial);
}