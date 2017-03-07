"use strict";
//文章控制器
const articleCtrl = require('../../controller/admin/article.server.controllers');
const multipart =require("connect-multiparty")
const multipartMiddleware = multipart();

module.exports = function(app) {
	app.get('/admin/article/list', articleCtrl.list);
	app.post('/admin/article/page', articleCtrl.page);
	app.post('/admin/article/search', articleCtrl.doSearch);
	app.post('/admin/article/remove', articleCtrl.remove);
	app.post('/admin/article/sub',articleCtrl.sub);
	app.post('/admin/article/find', articleCtrl.find);
	app.post('/admin/article/update', articleCtrl.update);
	app.post('/admin/article/del', articleCtrl.del);
	app.post('/admin/article/testUpload',articleCtrl.testUpload);
	app.post('/admin/article/publish',articleCtrl.publish);			//新的发布路由
	
}
