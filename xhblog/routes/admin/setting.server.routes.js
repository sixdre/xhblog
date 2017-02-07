//网站设置控制器
var settingCtrl = require('../../controller/admin/setting.server.controllers');



module.exports = function(app) {
	app.get('/admin/setting',settingCtrl.showSettings);
	
	app.post('/admin/setting/post_banner',settingCtrl.post_banner);			//首页轮播图
	app.post('/admin/setting/addFriend',settingCtrl.addFriend);	//友情链接
	
}
