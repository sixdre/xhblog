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
router.get('/article/:bId',Common.loadCommonData,function(req,res,next){
	const bid=req.params["bId"];
	async.auto({			//智能控制
		doc:function(callback){
			Article.findByBId(bid,function(article){
				if(!article){			//没找到就发送一个404
//					let err = new Error('Not Found');
//					err.status = 404;
//					return next(err);
					return res.status(404).render('www/404');
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
				let prevArticleName=prevArticle;
				callback(null,prevArticle);
			});
		},
		comments:["doc",function(results,callback){
			let articleId=results.doc._id;
			Comment.find({articleId:articleId})
			.populate('from')
			.populate('reply.from reply.to').sort({'likeNum':-1}).exec(function(err,comments){
				let cTotal=comments.length;
				comments.forEach(function(value){
					if(value.reply&&value.reply.length>0){
						cTotal+=value.reply.length;
					}
				})
				results.cTotal=cTotal;
				callback(null,comments);
			});
		}],
	},function(err,results){
		
		let rsObj={
			article:results.doc,
			hot:results.hot,
			title:results.doc.title,
			nextArticle:results.nextArticle,
			prevArticle:results.prevArticle,
			comments:results.comments,			//评论
			cTotal:results.cTotal			//评论数量
		}
		res.render("www/new_detial",rsObj);
	});
})


//评论
router.get('/comment',function(req,res,next){
	let articleId=req.query.articleId,
		order_by=req.query.order_by,
		page=req.query.page;
		let sort={
			likeNum:-1
		}
		if(order_by=="timeSeq"){
			sort={
				create_time:1
			}
		}else if(order_by=="timeRev"){
			sort={
				create_time:-1
			}
		}
		Comment.findBySort(articleId,sort).then(function(comments){
			if(comments){
				res.render("www/blocks/comment_list",{
					comments:comments
				});
			}
		}).catch(function(err){
			if(err){
				console.log(err);
				res.status(500);
			}
		})
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
router.post('/comment/point',Auth.checkLoginByAjax,function(req,res,next){
	let commentId=req.body.commentId,
		replyId=req.body.replyId,
		user=req.session['User'];
		if(!commentId){
			return res.status(500).json({
				message:'请求参数有误'
			})
		}
		Comment.findOne({_id:commentId}).exec(function(err,comment){
			if(err){
				console.log('评论点赞出错:'+err);
				return next(err);
			}
			if(comment&&!replyId){	//评论点赞
				if(comment.likes.indexOf(user._id)>-1){
					res.json({
						code:-2,
						message:'您已点赞'
					})
				}else{
					comment.likes.push(user._id);
					comment.save(function(err,ct){
						if(err){
							console.log('评论点赞保存出错:'+err);
							return next(err);
						}
						res.json({
							code:1,
							message:'点赞更新成功'
						});
					});
				}
			}else if(comment&&replyId){		//给回复点赞
				let reply=comment.reply;
				reply.forEach(function(value){
					if(value._id==replyId){
						if(value.likes.indexOf(user._id)>-1){
							return res.json({
								code:-2,
								message:'您已点赞'
							})
						}
						value.likes.push(user._id);
						comment.save(function(err){
							if(err){
								console.log('评论点赞保存出错:'+err);
								return next(err);
							}
							res.json({
								code:1,
								message:'点赞更新成功'
							})
						})
					}
				})
			}
		})
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







