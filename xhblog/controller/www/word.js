"use strict";
const express = require('express');
const router = express.Router();
//引入数据模型  
const mongoose=require('mongoose');
const Lm = mongoose.model('Lm');				//留言
const async = require('async');
const events = require('events');				//事件处理模块


/*
 * 
 * getWord 获取留言数据
 */
exports.getWord=function(req,res,next){
	res.render("www/word",{
		title:'留言'
	});
}

/*
 * postWord 提交留言
 */
exports.postWord=function(req,res,next){
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
}














