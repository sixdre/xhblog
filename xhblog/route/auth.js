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
	  password=req.body.password,
	  ref=req.query.ref,
	  articleId=req.query.articleId;
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
				return console.dir("查询出错");
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
					message:"登录成功！",
					ref:ref,
					articleId:articleId
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
				return console.dir("查询出错");
			}else if(result){
				res.json({
					code:-1,
					message:"用户名已被创建"
				});
			}else{
				user.save(function(err){
					if(err){
						return console.dir("保存用户出错");
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
		code:1
	});
})

module.exports = router;














