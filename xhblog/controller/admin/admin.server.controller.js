"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');			//文章
/*const Manager = mongoose.model('Manager');			//管理员*/
const User = mongoose.model('User');			//管理员
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
		let manger = req.session["manger"];
		Article.count({},function(err,c){
			res.render('admin/admin', 
				{
					title: '个人博客后台管理系统',
					manger: manger||{},
					total:c,
				});
		});
	},
	//前台请求主数据接口
	loadData:function(req,res){
		let manger = req.session["manger"];
		async.waterfall([function(callback){
			Lm.find({"meta.isRead":false}).populate('user','username').exec(function(err,lmdoc){
				console.log(lmdoc);
				if(err){
					return console.log("err");
				}
				callback(null,lmdoc);
			})
		},function(lmdoc,callback){
			Article.count({}).exec(function(err,total){
				if(err){
					return console.log("err");
				}
				callback(null,lmdoc,total);
			})
		},function(lmdoc,total,callback){
			Category.find({}).exec(function(err,categorys){
				if(err){
					return console.log("err");
				}
				callback(null,lmdoc,total,categorys);
			})
		},function(lmdoc,total,categorys,callback){
			Tag.find({}).exec(function(err,tags){
				if(err){
					return console.log("err");
				}
				callback(null,lmdoc,total,categorys,tags);
			})
		}
		],function(err,lmdoc,total,categorys,tags){
			res.json({
				manger: manger,	//管理员
				total:total,		//文章总数
				lmdoc:lmdoc,		//留言
				categorys:categorys,	//文章分类
				tags:tags			//文章标签
			});
		})
	},
	//后台退出
	logout:function(req, res) {
		delete req.session["manger"];
		res.json({
			code : 1
		});
	},
	//注册提交
	doRegist:function(req, res) {
		let manger = new User({
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
			User.findOne({email:req.body.email}).then(function(user2){
				if(user2){
					return res.json({
						code:-2,
						message:'该邮箱已被注册'
					});
				}
				manger.isAdmin=true;
				manger.save(function(err, manger) {
					if(err){
						return console.log(err);
					}
					res.json({
						code:1,
						message:'成功创建超级管理员！'
					})
				});
			})
			
		})
		
		
		
		/*User.findOne({isAdmin:true},function(err,user){
			if(err){
				return console.log(err);
			}else if(user){
				return res.json({
					code:-1,
					message:'已有超级管理员，不可重复创建'
				})
			}else{
				User.findOne({})
				manger.isAdmin=true;
				manger.save(function(err, manger) {
					if(err){
						return console.log(err);
					}
					res.json({
						code:1,
						message:'成功创建超级管理员！'
					})
				});
			}
		})*/
	},
	//登录提交验证
	doLogin:function(req, res) {
		let email=req.body.email;
		let password=req.body.password;
		User.findOne({email:email},function(err,manger){
			if(err){return console.dir(err)}
			if(!manger||manger.isAdmin==false){
				res.json({code:-1});
			}else{
				if(manger.password == md5(password)){
					req.session["manger"] = manger;
					res.json({code : 1});
				}else{
					res.json({code : -2});
				}
			}
		})
	}
}

