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
//验证
const Auth=require('../middleware/auth');

const BaseQuery=require('../models/dbHelper'),
	  aQuery=BaseQuery.ArticlesQuery;

//首页面初始化
function init(currentPage,cb){
	let settings=app.locals.settings;
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
			let query=aQuery();
			Article.count(query).exec(function(err,total){	//所有文章数量
				callback(null,total);
			})
		},
		articles:function(callback){
			let pageSize=parseInt(settings.PageSize);
			let query=aQuery();
			Article.find(query).skip((currentPage-1)*pageSize)
			.limit(pageSize).sort({create_time:-1})
			.populate('category','name')
			.populate('tags').exec(function(err,articles){
				console.log(articles);
				callback(null,articles);
			})
		},
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
		results.settings=settings;
		cb(results);
	})
}

//router.get("*",Common.loadCommonData);

router.get('/',Common.loadCommonData,function(req,res,next){
	let currentPage=1;
	init(currentPage,function(results){
		res.render('www/new', {
			title: results.settings.SiteName,
			banners:results.banners,
			total:results.total,
			articles:results.articles,	//所有文章
			newArticle:results.newArticle[0],	//最新文章
			hot:results.hot,				//热门文章
			currentpage:currentPage,	//当前页码
			pagesize:parseInt(results.settings.PageSize)			//列表数
		});
	});
})

router.get('/page/:page',Common.loadCommonData,function(req,res,next){
	let currentPage=parseInt(req.params["page"]);
	init(currentPage,function(results){
		res.render('www/new', {
			title: results.settings.SiteName,
			banners:results.banners,
			total:results.total,
			articles:results.articles,	//所有文章
			newArticle:results.newArticle[0],	//最新文章
			hot:results.hot,				//热门文章
			currentpage:currentPage,	//当前页码
			pagesize:parseInt(results.settings.PageSize)			//列表数
		});
	});
})




//留言页面
router.get('/word',Auth.checkLoginByNative,function(req,res,next){
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

