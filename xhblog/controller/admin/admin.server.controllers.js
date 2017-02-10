//引入数据模型  
var mongoose=require('mongoose');
var Article = mongoose.model('Article');			//文章
var Manager = mongoose.model('Manager');			//管理员
var Lm=mongoose.model("Lm");						//留言

var formidable = require('formidable');
var fs = require('fs'); 							//node.js核心的文件处理模块
const async = require('async');

/*var multer = require ('multer');   
var upload = multer({ dest:  "public/upload" });  */

module.exports={
	showadmin:function(req,res){
		var loginmanager = req.session["manager"];
		Article.count({},function(err,c){
			res.render('admin/admin', 
				{
					title: '个人博客后台管理系统',
					loginmanager: loginmanager||{},
					total:c,
				});
		})
		/*if(loginmanager){
			Article.count({},function(err,c){
				res.render('admin/admin', 
					{
						title: '个人博客后台管理系统',
						loginmanager: loginmanager||{},
						total:c,
					});
			})
		}else{
			res.redirect('login');
		}*/
	},
	loadData:function(req,res){
		var loginmanager = req.session["manager"];
		async.waterfall([function(callback){
			Lm.find({}).exec(function(err,lmdoc){
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
		}],function(err,lmdoc,total){
			res.json({
				loginmanager: loginmanager||{},
				total:total,
				lmdoc:lmdoc
			});
		})
	},
	//后台管理登录
	showlogin:function(req,res){
		res.render('admin/login', {
			title: '后台管理登录'
		});
	},
	//后台管理注册
	showregist:function(req, res) {
		res.render('admin/regist', {
			title: '后台管理注册'
		});
	},
	//后台退出
	logout:function(req, res) {
		delete req.session["manager"]
		res.json({
			code : 1
		})
	},
	//注册提交
	doRegist:function(req, res) {
		var manger = new Manager({
			name: req.body.name,
			email:req.body.email,
			password: md5(req.body.password)
		});
		Manager.findOne({power:1},function(err,manager1){
			if(err){
				return console.log(err);
			}else if(manager1){
				res.json({
					code:-1,
					message:'已有超级管理员，不可重复创建'
				})
				return;
			}else{
				manger.save(function(err, manger) {
					if(err){
						return console.log(err)
					}
					res.json({
						code:1,
						message:'成功创建超级管理员！'
					})
				});
			}
		})
	},
	//登录提交验证
	doLogin:function(req, res) {
		var email=req.body.email;
		var password=req.body.password;
		Manager.findOne({email:email},function(err,manager){
			if(err){return console.dir(err)}
			if(!manager){
				res.json({code:-1})
			}else{
				if(manager.password == md5(password)){
					req.session["manager"] = manager
					res.json({code : 1})
				}else{
					res.json({code : -2})
				}
			}
		})
	}
}

