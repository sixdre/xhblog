"use strict";
const express = require('express');
const router = express.Router();
//引入数据模型  
const mongoose=require('mongoose');
const Comment=mongoose.model('Comment');		//评论
const async = require('async');
const events = require('events');				//事件处理模块


/*
 * 
 * getComment 获取评论
 */
exports.getComment=function(req,res,next){
	
}

/*
 * postComment  提交评论
 */
exports.postComment=function(req,res,next){
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
		
		/*Comment.findOne({_id:_comment.cId},function(err,comment){
			let reply={
				from:_comment.from,
				to:_comment.toId,
				content:_comment.content,
				create_time:Date.now()
			};
			comment.reply.push(reply);
			comment.save(function(err,comment){
				res.json({
					code:1
				});
			})
			
		})*/
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
}














