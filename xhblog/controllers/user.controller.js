/*
 * 用户控制器
 */
"use strict";
const path = require('path');
const fs = require('fs');
const async = require('async');
const md5 = require('md5');
const _ = require('underscore');
const mongoose = require('mongoose');

//数据模型
const User = mongoose.model("User");


//获取用户
exports.getUsers=function(req,res,next){
	User.findAll().then(function(users) {
		res.json({
			code: 1,
			users: users,
			message: '获取用户列表成功'
		})
	}).catch(function(err) {
		console.log('查询用户列表出错:' + err);
		next(err);
	})
}

//用户注册
exports.regist=function(req,res,next){
	let username=req.body.username,
	  password=req.body.password,
	  email=req.body.email;
	let user=new User({
		username:username,
		password:md5(password),
		email:email
	});
	if(validator.isEmpty(username)){
		res.json({
			code:-2,
			message:"用户名不得为空！"
		});
	}else if(validator.isEmpty(password)){
		res.json({
			code:-2,
			message:"密码不得为空！"
		});
	}else if(validator.isEmpty(email)){
		res.json({
			code:-2,
			message:"邮箱不得为空！"
		});
	}else if(!validator.isEmail(email)){
		res.json({
			code:-2,
			message:"请输入正确的邮箱！"
		});
	}else if(!validator.isLength(password,{min:3})){
		res.json({
			code:-2,
			message:"密码不得小于3位！"
		});
	}else{
		User.findOne({username:username},function(err,result){
			if(err){
				console.dir("查询出错");
				return next(err);
			}else if(result){
				res.json({
					code:-1,
					message:"用户名已被创建"
				});
			}else{
				user.save(function(err){
					if(err){
						console.dir("保存用户出错"+err);
						return next(err);
					}
					res.json({
						code:1,
						message:"成功注册"
					});
				});
			}
		});
	}
}

//用户登录
exports.login=function(req,res,next){
	let username=req.body.username,
	  password=req.body.password;
	if(validator.isEmpty(username)){
		res.json({
			code:-2,
			message:"请输入用户名！"
		});
	}else if(validator.isEmpty(password)){
		res.json({
			code:-2,
			message:"请输入密码！"
		});
	}else{
		User.findOne({username:username},function(err,user){
			if(err){
				console.dir("查询出错");
				next(err);
			}else if(!user){
				res.json({
					code:-1,
					message:"该用户没有注册！"
				})
			}else if(user&&user.password!==md5(password)){
				res.json({
					code:0,
					message:"用户密码不正确！"
				})
			}else{
				req.session["User"] = user;
				res.json({
					code:1,
					message:"登录成功！"
				});
//				res.redirect('back');
			}
		})	
	}
}

//用户退出
exports.logout=function(req,res,next){
	delete req.session['User'];
	delete app.locals.user;
	res.json({
		code:1,
		message:'退出登陆成功'
	});
}



//管理员注册
exports.admin_regist=function(req,res,next){
	let manager = new User({
		username: req.body.username,
		email:req.body.email,
		password: md5(req.body.password)
	});
	User.findOne({isAdmin:true}).exec().then(function(user1){
		if(user1){
			throw {
				code:-1,
				message:'已有超级管理员，不可重复创建'
			};
		}
		return User.findOne({username:req.body.username}).exec();
	}).then(function(user2){
			if(user2){
				throw {
					code:-2,
					message:'该用户名已被注册'
				};
			}
			manager.isAdmin=true;
			manager.save().then(function(manager){
				res.json({
					code:1,
					message:'成功创建超级管理员！'
				});
			});
	}).catch(function(err){
		console.log('注册失败:'+err);
		if(err.code){
			return res.json({
				code:err.code,
				message:err.message
			});
		}
		next(err);
	});
}

//管理员登录
exports.admin_login=function(req,res,next){
	let username=req.body.username;
	let password=req.body.password;
	User.findOne({username:username}).then(function(manager){
		if(!manager|| !manager.isAdmin){
			res.json({
				code:-1,
				message:'账号不存在'
		    });
		}else if(manager.password == md5(password)){
			req.session["manager"] = manager;
			res.json({
				code : 1,
				message:'登陆成功'	//登陆成功
			});			
		}else{
			res.json({
				code : -2,
				message:'密码错误'	//密码错误
			});			
		}
	}).catch(function(err){
		console.log('登陆出错:'+err);
		next(err);
	})
}

//管理员退出
exports.admin_logout=function(req,res,next){
	delete req.session['manager'];
	res.json({
		code:1,
		message:'退出登陆成功'
	});
}


//删除用户
exports.remove=function(req,res,next){
	
}

