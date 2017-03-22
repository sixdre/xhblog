"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');			//文章
const User = mongoose.model('User');				//用户
const Lm=mongoose.model("Lm");						//留言
const Category=mongoose.model("Category");			//文章分类
const Tag=mongoose.model("Tag");					//文章标签
const formidable = require('formidable');
const fs = require('fs'); 							//node.js核心的文件处理模块
const async = require('async');



/*var multer = require ('multer');   
var upload = multer({ dest:  "public/upload" });  */

module.exports={
	showadmin:function(req,res){
		res.render('admin/admin', {
			title: '个人博客后台管理系统',
		});
	},
	//前台请求主数据接口
	loadData:function(req,res){
		let manager = req.session["manager"];
		async.parallel({
			lmdoc:function(callback){
				Lm.find({"meta.isRead":false}).populate('user','username').exec(function(err,lmdoc){
					if(err){
						callback(err);
					}
					callback(null,lmdoc);
				})
			},
			total:function(callback){
				Article.count({}).exec(function(err,total){
					if(err){
						callback(err);
					}
					callback(null,total);
				})
			},
			categorys:function(callback){
				Category.find({}).exec(function(err,categorys){
					if(err){
						callback(err);
					}
					callback(null,categorys);
				})
			},
			tags:function(callback){
				Tag.find({}).exec(function(err,tags){
					if(err){
						callback(err);
					}
					callback(null,tags);
				})
			}
		},function(err,results){
			res.json({
				manager:manager,	//管理员
				total:results.total,		//文章总数
				lmdoc:results.lmdoc,		//留言
				categorys:results.categorys,	//文章分类
				tags:results.tags			//文章标签
			});
		});
	},
	//后台退出
	logout:function(req, res) {
		delete req.session["manager"];
		res.json({
			code : 1
		});
	},
	//注册提交
	doRegist:function(req, res) {
		let manager = new User({
			username: req.body.name,
			email:req.body.email,
			password: md5(req.body.password)
		});
		User.findOne({isAdmin:true}).then(function(user1){
			if(user1){
				return res.json({
					code:-1,
					message:'已有超级管理员，不可重复创建'
				});
			}
			return user1
		}).then(function(user1){
			User.findOne({email:req.body.email}).then(function(user2){
				if(user2){
					return res.json({
						code:-2,
						message:'该邮箱已被注册'
					});
				}
				manager.isAdmin=true;
				manager.save(function(err, manager) {
					if(err){
						return console.log(err);
					}
					res.json({
						code:1,
						message:'成功创建超级管理员！'
					})
				});
			})
		}).catch(function(err){
			console.log('注册失败:'+err)
		});
	},
	//登录提交验证
	doLogin:function(req, res) {
		let email=req.body.email;
		let password=req.body.password;
		User.findOne({email:email}).then(function(manager){
			if(!manager||manager.isAdmin==false){
				res.json({code:-1});
			}else{
				if(manager.password == md5(password)){
					req.session["manager"] = manager;
					res.json({code : 1});
				}else{
					res.json({code : -2});
				}
			}
		}).catch(function(err){
			console.log('登陆出错:'+err)
		})
	}
}

