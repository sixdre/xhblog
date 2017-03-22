"use strict";
//后台
const adminRouter=require('./admin.server.route');

//网站
const IndexRouter=require('./index.server.route')

module.exports=function(app){
	adminRouter(app);		//后台
	IndexRouter(app);		//网站
}
