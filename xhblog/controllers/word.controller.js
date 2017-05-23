/*
 * 留言控制器
 */
"use strict";
const path = require('path');
const fs = require('fs');
const async = require('async');
const _ = require('underscore');
const mongoose = require('mongoose');

//数据模型
const Word = mongoose.model("Word");


//获取留言
exports.getTags=function(req,res,next){
	Word.find({"state.isRead":false}).populate('user','username').exec(function(err,words){
		if(err){
			return next(err);
		}
		res.json({
			code:1,
			words:words,
			message:'获取留言成功'
		})
	})
}

//添加留言
exports.add=function(req,res,next){
	let word=new Word({
		message:req.body.content,
		user:req.session["User"]._id
	});
	word.save(function(err){
		if(err){
			console.dir("留言失败:"+err);
			return next(err);
		}
		res.json({
			code:1,
			message:'留言成功'
		});
	});
}


//留言回复
exports.reply=function(req,res,next){
	let id = req.body.id,
		content = req.body.replyContent;
	Word.update({
		_id: id
	}, {
		$set: {
			"reply.user": req.session['manager']._id,
			"reply.content": content,
			"reply.replyTime": new Date(),
			"state.isRead": true,
			"state.isReply": true
		}
	}).exec(function(err) {
		if(err) {
			console.log(err);
			next(err);
		}
		res.json({
			code: 1,
			message: '留言回复成功'
		});
	});
}

//删除留言
exports.remove=function(req,res,next){

}

