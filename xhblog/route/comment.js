"use strict";
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const async = require('async');
const mongoose=require('mongoose');
//数据模型
const Article = mongoose.model('Article');			//文章
const User = mongoose.model('User');
const Comment=mongoose.model('Comment');		//评论

const Auth=require('../middleware/auth');


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

module.exports = router;







