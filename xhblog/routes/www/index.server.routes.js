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
	
	
	//app.post('/detial:cc', Index.showDetial);
}