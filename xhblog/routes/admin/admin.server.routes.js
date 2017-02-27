var adminCtrl = require('../../controller/admin/admin.server.controllers');

module.exports = function(app) {
	app.get('/admin', adminCtrl.showadmin);
	app.get('/admin/login', adminCtrl.showlogin);
	app.get('/admin/regist', adminCtrl.showregist);
	app.post('/admin/logout', adminCtrl.logout);
	app.post('/admin/doRegist', adminCtrl.doRegist);
	app.post('/admin/doLogin', adminCtrl.doLogin);
	app.get('/admin/loadData', adminCtrl.loadData);
	
}


	
