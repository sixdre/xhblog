"use strict";
//后台
const adminRouter=require('./admin/admin.server.routes');
const articleRouter=require('./admin/article.server.routes');
const settingRouter=require('./admin/setting.server.routes');

//网站
const IndexRouter=require('./www/index.server.routes')

module.exports=function(app){
	adminRouter(app);		//后台
	articleRouter(app);		//后台文章路由
	settingRouter(app);		//后台网站设置
	IndexRouter(app);		//网站
}
