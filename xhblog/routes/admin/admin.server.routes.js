const adminCtrl = require('../../controller/admin/admin.server.controllers');

module.exports = function(app) {
	app.get('/admin', adminCtrl.showadmin);
	app.post('/admin/logout', adminCtrl.logout);
	app.post('/admin/doRegist', adminCtrl.doRegist);
	app.post('/admin/doLogin', adminCtrl.doLogin);
	app.get('/admin/loadData', adminCtrl.loadData);
	
}


	
