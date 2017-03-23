"use strict";
const express = require('express');
const router = express.Router();
const async = require('async');
const events = require('events');				//事件处理模块
const path = require('path');
const tool =require('../utility/tool');
const mongoose=require('mongoose');

//数据模型
const Article = mongoose.model('Article');			//文章
const Category=mongoose.model("Category");			//类型
const Banner = mongoose.model('Banner');			//轮播图
const User = mongoose.model('User');				//用户
const Lm = mongoose.model('Lm');				//留言
const Friend=mongoose.model("Friend");			//友链
const Comment=mongoose.model('Comment');		//评论

//公用数据
const Common=require('./common');


router.get('/',Common.loadCommonData,function(req,res,next){
	let currentPage=req.params["page"]?req.params["page"]:1;
	async.auto({
		banners:function(callback){
			Banner.find({}).sort({weight:-1}).limit(3).exec(function(err,banners){
				if(err){
					callback(err);
				}
				callback(null,banners);
			})
		},
		total:function(callback){
			Article.count({},function(err,total){	//所有文章
				callback(null,total);
			})
		},
		settings:function(callback){
			 tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
		        if (err) {
		        	callback(err);
		        } else {
		        	callback(null,settings); 
		        }
		    });
		},
		articles:['settings',function(results,callback){
			let pageSize=parseInt(results.settings.PageSize);
			Article.find({}).skip((currentPage-1)*pageSize)
			.limit(pageSize).sort({create_time:-1})
			.populate('category','name')
			.populate('tags').exec(function(err,articles){
				callback(null,articles);
			})
		}],
		newArticle:function(callback){
			Article.findNew(1,function(newArticle){
				callback(null,newArticle);
			});
		},
		hot:function(callback){
			Article.findByHot(3,function(hot){
				callback(null,hot);
			})
		}
		
	},function(err,results){
		res.render('www/', {
			title: '个人博客首页',
			banners:results.banners,
			total:results.total,
			articles:results.articles,	//所有文章
			newArticle:results.newArticle[0],	//最新文章
			hot:results.hot,				//热门文章
			currentpage:currentPage,	//当前页码
			pagesize:parseInt(results.settings.PageSize)			//列表数
		});
	})
})

//评论
router.post('/comment',function(req,res,next){
	let _comment=req.body;
	_comment.from=req.session["User"];
	if(_comment.cId){
		let reply={
			from:_comment.from._id,
			to:_comment.toId,
			content:_comment.content
		};
		Comment.update({_id:_comment.cId},{
			$addToSet:{"reply": reply}
		}).then(function(){
			res.json({
				code:1
			});
		}).catch(function(err){
			console.log(err);
		});
	}else{
		let comment=new Comment(_comment);
		comment.save().then(function(comment){
			res.json({
				code:1
			});
		}).catch(function(err){
			console.log('评论报错出错:'+err);
		});
	}
})


//留言页面
router.get('/word',Common.checkLoginByNative,function(req,res,next){
	res.render("www/word",{
		title:'留言'
	});
})

//提交留言
router.post('/word',function(req,res,next){
	let lm=new Lm({
		message:req.body.content,
		user:req.session["User"]._id
	});
	lm.save(function(err){
		if(err){
			return console.dir("留言失败:"+err)
		}
		res.json({
			code:1
		});
	});
})


//关于页面
router.get('/about',function(req,res,next){
	res.render("www/about",{
		title:'关于我'
	})
})


module.exports = router;

