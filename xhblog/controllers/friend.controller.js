/*
 * 友情链接控制器
 */
"use strict";
const path = require('path');
const fs = require('fs');
const async = require('async');
const _ = require('underscore');
const mongoose = require('mongoose');

//数据模型
const Friend = mongoose.model("Friend");


//获取友情链接
exports.getFriends=function(req,res,next){
	let page=parseInt(req.query.page)||1;		//当前页
	let limit=parseInt(req.query.limit)||parseInt(CONFIG.FriendLimit);	//每页数量
	async.waterfall([
		function(cb){
			Friend.count({}).exec(function(err,total){
				let allPage=Math.ceil(total/limit);
				cb(null,allPage);
			})
		},
		function(allPage,cb){
			if(page>allPage){
				page=1;
			}
			Friend.find({}).sort({'sort':-1}).skip((page-1)*limit)
				.limit(limit).exec(function(err,friends){
				cb(null,allPage,friends);
			})
		}
	],function(err,allPage,friends){
		if(err){
			return next(err);
		}
		res.json({
			code:1,
			allPage:allPage,
			current_page:page,
			friends:friends||[]
		})
	})
}

//添加友情链接
exports.add=function(req,res,next){
	const title = req.body.title,
		url = req.body.url,
		sort = req.body.sort;
		
	let friend = new Friend({
		title: title,
		url: url,
		sort: sort
	});
	Friend.findOne({
		title: title
	}).then(function(doc) {
		if(doc) {
			throw {
				code: -2,
				message: '该友链已经添加过了'
			}
		}
		return friend.save();
	}).then(function(doc) {
		res.json({
			code: 1,
			friend: doc,
			message: '添加成功'
		});
	}).catch(function(err) {
		console.log('友链添加出错:' + err);
		if(err.code) {
			return res.json({
				code: err.code,
				message: err.message
			})
		}
		next(err);
	})
}


//更新友情链接
exports.update=function(req,res,next){
	const id = req.body._id,
		title = req.body.title,
		url = req.body.url,
		sort = req.body.sort;
	Friend.update({
		_id: id
	}, {
		"title": title,
		"url": url,
		"sort": sort,
		"meta.update_time": Date.now()
	}).then(function() {
		res.json({
			code: 1,
			message: '更新成功'
		});
	}).catch(function(err) {
		console.log('update err :' + err);
		next(err);
	});
}

//删除友情链接
exports.remove=function(req,res,next){
	let id = req.params['id'];
	Friend.remove({
		_id: id
	}).then(function() {
		res.json({
			code: 1,
			message: '删除成功'
		});
	}).catch(function(err) {
		console.log('友链删除失败:' + err);
		next(err);
	});
}

