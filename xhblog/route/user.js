"use strict";
const express = require('express');
const router = express.Router();
//引入数据模型  
const mongoose=require('mongoose');
const User = mongoose.model('User');				//用户
const async = require('async');					
const events = require('events');				//事件处理模块

//显示登陆页面
router.get('/login',function(req,res,next){
	res.render("www/login",{
		title:"用户登录"
	});
})
//登陆提交
router.post('/login',function(req,res,next){
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
				
			}
		})	
	}
})

//显示注册页面
router.get('/regist',function(req,res,next){
	res.render("www/regist",{
		title:"用户注册"
	});
})

//注册提交
router.post('/regist',function(req,res,next){
	let username=req.body.username,
	  password=req.body.password,
	  email=req.body.email;
	let user=new User({
		username:username,
		password:md5(password),
		email:req.body.email
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
				next(err);
			}else if(result){
				res.json({
					code:-1,
					message:"用户名已被创建"
				});
			}else{
				user.save(function(err){
					if(err){
						console.dir("保存用户出错");
						next(err);
					}
					res.json({
						code:1,
						message:"成功注册"
					});
				});
			}
		});
	}
})



//退出登陆
router.get('/logout',function(req,res,next){
	delete req.session['User'];
	delete app.locals.user;
	res.json({
		code:1,
		message:'退出登陆成功'
	});
})

//router.get('/admin_logout',function(req,res,next){
//	delete req.session['manager'];
//	res.json({
//		code:1,
//		message:'退出登陆成功'
//	});
//})
//后台登陆
router.post('/admin_login',function(req,res,next){
	console.log('sxs')
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
})


//后台注册
router.post('/admin_regist',function(req,res,next){
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
})




module.exports = router;














