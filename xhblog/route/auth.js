"use strict";
//用户操作验证
/*
 * 后台操作检查
 */
exports.checkAdmin=function(req,res,next){
//	if(req.session['manager']){
//		res.setHeader('AUTH', 'admin')
//	}
//	next()
}
/*
 * 对ajax请求进行用户状态检查
 */
exports.checkLoginByAjax=function(req,res,next){
	if(!req.session["User"]){
       return res.json({
    	   code:-2
       });
    }
	next();
}
/*
 * 对表单请求或者链接跳转进行用户状态检查
 */
exports.checkLoginByNative=function(req,res,next){
	if(!req.session["User"]){
		return res.redirect('login');
	}
	next();
}

