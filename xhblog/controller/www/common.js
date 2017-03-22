"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');			//文章
const Category=mongoose.model("Category");			//类型
const Banner = mongoose.model('Banner');			//轮播图
const User = mongoose.model('User');				//用户
const Lm = mongoose.model('Lm');				//留言
const Friend=mongoose.model("Friend");			//友链
const Comment=mongoose.model('Comment');		//评论
const async = require('async');
const events = require('events');				//事件处理模块


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

/*
 * 加载网站公共的数据（页面导航，友情链接 
 */
exports.loadCommonData=function(req,res,next){
	//查询不同类型文章的数量new
	let categorys = [];
	let obj ;
	let j = 0;
	let myEventEmitter = new events.EventEmitter();
	async.auto({
		friends:function(cb){
			 Friend.find({}).exec(function(err,friends){
				  cb(null,friends)
			 });
		},
		types:function(cb){
			 Article.aggregate([{$group : {_id:"$category", total : {$sum : 1}}}]).exec(function(err,types){
				  cb(null,types);
			 });
		},
		categorys:["types",function(tt,cb){
			 myEventEmitter.on('next',addResult);
			  function addResult() {
				   categorys.push(obj);
				    j++;
				    if(j==tt.types.length){
				    	cb(null,categorys);
				    }
			  }
			  tt.types.forEach(function(rst,i){
					Category.findOne({_id:rst._id}).exec(function(err,cate){
						rst.name=cate.name;
				        obj = rst;
				        myEventEmitter.emit('next');
					});
			   });
		}]
	},function(err,results){
		 app.locals.friends=results.friends;		//友链
		 app.locals.categorys=results.categorys;	//根据文章类型同计数量
	})
	next();
}
