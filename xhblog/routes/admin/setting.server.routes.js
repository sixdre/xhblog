//网站设置控制器
var settingCtrl = require('../../controller/admin/setting.server.controllers');



module.exports = function(app) {
	app.get('/admin/setting',settingCtrl.showSettings);
	
	app.post('/admin/setting/sub',settingCtrl.sub);
	
	
}
