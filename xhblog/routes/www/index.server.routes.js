var IndexCtrl = require('../../controller/www/index.server.controllers');
module.exports = function(app) {
	app.get('/', IndexCtrl.showIndex);
	app.get('/page/:page', IndexCtrl.showIndex);
	app.get('/detial/:bid', IndexCtrl.showDetial);
	app.get('/search', IndexCtrl.showSearchResults);
	app.get('/login', IndexCtrl.showLogin);
	app.get('/regist', IndexCtrl.showRegist);
	
	app.get('/doLogin', IndexCtrl.doLogin);
	app.post('/doRegist', IndexCtrl.doRegist);
	
	//app.post('/detial:cc', Index.showDetial);
}