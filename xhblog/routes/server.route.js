"use strict";
//后台
const adminRouter=require('./admin/admin.server.route');
const articleRouter=require('./admin/article.server.route');
const settingRouter=require('./admin/setting.server.route');

//网站
const IndexRouter=require('./www/index.server.route')

module.exports=function(app){
	adminRouter(app);		//后台
	articleRouter(app);		//后台文章路由
	settingRouter(app);		//后台网站设置
	IndexRouter(app);		//网站
}
