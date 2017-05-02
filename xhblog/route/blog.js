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
const Auth=require('../middleware/auth');

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
		res.render("www/new_detial",{
			article:results.doc,
			hot:results.hot,
			title:results.doc.title,
			nextArticle:results.nextArticle,
			prevArticle:results.prevArticle,
			comments:results.comments			//评论
		});
	});
})


//评论
router.get('/comment',function(req,res,next){
	let articleId=req.query.articleId,
		order_by=req.query.order_by,
		page=req.query.page;
		
		Comment.find({articleId:articleId})
		.populate('from')
		.populate('reply.from reply.to').sort({create_time:-1}).exec(function(err,comments){
			if(err){
				console.log(err);
				next(err);
			}
			res.json({
				code:1,
				comments:comments
			})
		});
})


//提交评论
router.post('/comment',Auth.checkLoginByAjax,function(req,res,next){
	let _comment=req.body;
	_comment.from=req.session["User"];
	if(_comment.cId){
		let reply={
			from:_comment.from._id,
			to:_comment.toId,
			content:_comment.content,
			create_time:new Date()
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

//评论点赞
router.get('/comment/point',function(req,res,next){
	let commentId=req.query.commentId,
		replyId=req.query.replyId;
		
		if(!commentId){
			return res.json({
				code:-2,
				message:'请求参数有误'
			})
		}
		if(commentId&&!replyId){			//评论点赞
			Comment.update({_id:commentId},{'$inc':{'likes':1}}).then(function(){
				res.json({
					code:1,
					message:'点赞更新成功'
				})
			}).catch(function(err){
				console.log('评论点赞更新出错:'+err)
			})
		}else if(commentId&&replyId){		//给回复点赞
			Comment.findById(commentId).then(function(comment){
				console.log(comment.reply);
				comment.reply.forEach(function(value,key){
					if(value._id==replyId){
						value.likes+=1;
						comment.save(function(){
							res.json({
								code:1,
								message:'点赞更新成功'
							})
						})
						return;
					}
				})
			})
		}
})

//列出类型下的文章
router.get('/category/:name',function(req,res,next){
	let category_name=req.params.name;
	async.waterfall([
	      function(cb){
	    	   Category.findOne({name:category_name}).exec(function(err,category){
	    	   	if(category){
	    	   	   return cb(null,category);
	    	   	}
	    	   	cb({code:-1})
	    	   })
	       },function(category,cb){
	    	   Article.find({category:category._id}).populate('category','name').then(function(articles){
	    	   	if(articles){
	    	   	   return cb(null,category,articles);
	    	   	}
				});
	       }
	  ],function(err,category,articles){
	  		if(err&&err.code==-1){
	  			articles=[];
	  		}
			res.render('www/category',{
				articles:articles,
				title:category_name+'——徐浩的个人博客'
			});
	})
})


//搜索文章
router.get('/search',Common.loadCommonData,function(req,res,next){
	let title=req.query.wd;
	async.waterfall([
		function(callback){
			Article.find({title:{$regex:''+title+''}})
			.sort({create_time:-1})
			.exec(function(err,articles){
				callback(null,articles)
			});
		},
	],function(err,articles){
		if(err){
			console.log('文章查询出错:'+err);
			return next(err);
		}
		res.render("www/search_results",{
			articles:articles,
			title:'搜索结果'
		});
	});
})

module.exports = router;







