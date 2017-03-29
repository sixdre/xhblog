"use strict";
//后台
const adminRouter=require('./admin');

//网站
const indexRouter=require('./index');
const authRouter=require('./auth');
const blogRouter=require('./blog');

module.exports=function(app){
	
	app.use(function(req,res,next){
		let _user=req.session['User'];
		if(_user){
			app.locals.user=_user;
		}else{
			app.locals.user=undefined;
		}	
		next();
	});
	
	app.use('/',indexRouter);
	app.use('/',blogRouter);
	app.use('/',authRouter);
	app.use('/admin',adminRouter);
	
}
