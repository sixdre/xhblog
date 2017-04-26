"use strict";
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const async = require('async');
const mongoose=require('mongoose');

//数据模型
const Article = mongoose.model('Article');			//文章
const Category=mongoose.model("Category");
const Tag=mongoose.model('Tag');		
const Friend=mongoose.model("Friend");
const User = mongoose.model('User');
const Lm = mongoose.model('Lm');
const Comment=mongoose.model('Comment');		//评论
const BaseQuery=require('../models/dbHelper'),
	  aQuery=BaseQuery.ArticlesQuery;
//公用数据
const Common=require('./common');

//文章详情页面
router.get('/blog/:bId',Common.loadCommonData,function(req,res,next){
	const bid=req.params["bId"];
	async.auto({			//智能控制
		doc:function(callback){
			Article.findByBId(bid,function(article){
				if(!article){			//没找到就发送一个404
					//return res.send(404, "Oops! We didn't find it");
					return next('404');
				}
				let opts = [{
		            path   : 'category',
		            select : 'name'
		        }];
				article.populate(opts,function(err,doc){
					Article.findBybIdUpdate(bid,function(){
						callback(null,doc);
					});
				});
			});
		},
		hot:function(callback){
			Article.findByHot(2,function(hot){
				callback(null,hot);
			});
		},
		nextArticle:function(callback){
			Article.findNext(bid,function(nextArticle){		//下一篇
				callback(null,nextArticle);
			});
		},
		prevArticle:function(callback){
			Article.findPrev(bid,function(prevArticle){		//上一篇
				callback(null,prevArticle);
			});
		},
		comments:["doc",function(results,callback){
			let articleId=results.doc._id;
			Comment.find({articleId:articleId})
			.populate('from')
			.populate('reply.from reply.to').sort({create_time:-1}).exec(function(err,comments){
				callback(null,comments);
			});
		}]
		
	},function(err,results){
		res.render("www/detial",{
			article:results.doc,
			hot:results.hot,
			title:results.doc.title,
			nextArticle:results.nextArticle,
			prevArticle:results.prevArticle,
			comments:results.comments			//评论
		});
	});
})


//列出类型下的文章
router.get('/blog/category/:name',function(req,res,next){
	let category_name=req.params.name;
	async.waterfall([
	       function(cb){
	    	   Category.findOne({name:category_name}).exec(function(err,category){
	    		   cb(null,category);
	    	   })
	       },function(category,cb){
	    	   Article.find({category:category._id}).populate('category','name').then(function(articles){
	    		   cb(null,category,articles);
				});
	       }
	  ],function(err,category,articles){
			res.render('www/category',{
				articles:articles,
				title:category_name+'——徐浩的个人博客'
			});
	})
})


//搜索文章
router.get('/blog/search',function(req,res,next){
	let title=req.query.wd;
	async.waterfall([
		function(callback){
			Article.findByTitle(title,function(articles){
				callback(null,articles);
			});
		},
	],function(err,articles){
		res.render("www/search_results",{
			articles:articles,
			title:'搜索结果'
		});
	});
})

module.exports = router;







