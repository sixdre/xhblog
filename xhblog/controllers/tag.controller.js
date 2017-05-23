/*
 * 标签控制器
 */
"use strict";
const path = require('path');
const fs = require('fs');
const async = require('async');
const _ = require('underscore');
const mongoose = require('mongoose');

//数据模型
const Tag = mongoose.model("Tag");


//获取标签
exports.getTags=function(req,res,next){
	Tag.find({}).exec(function(err, tags) {
		if(err){
			return next(err);
		}
		res.json({
			code: 1,
			tags: tags
		});
	});
}

//添加标签
exports.add=function(req,res,next){
	let _tag = req.body.tag,
		id = _tag._id,
		name = _tag.name;
	let newtag = new Tag(_tag);
	
	Tag.findOne({
		name: name
	}).then(function(tag) {
		if(tag) {
			throw {
				code: -1,
				message: '已有此标签,不可重复'
			}
		}
		return newtag.save();
	}).then(function(tag) {
		res.json({
			code: 1,
			tag: tag,
			message: '添加成功'
		});
	}).catch(function(err) {
		console.log('类型添加失败:' + err);
		if(err.code) {
			return res.json({
				code: err.code,
				message: err.message
			})
		}
		next(err);
	});
}


//更新标签
exports.update=function(req,res,next){
	let tag = req.body.tag,
		id = tag._id,
		name = tag.name;
		
	Tag.findOne({
		name: name
	}).then(function(tag) {
		if(tag) {
			throw {
				code: -1,
				message: '已有此标签,不可重复'
			}
		}
		return Tag.update({_id: id}, {name: name}).exec();
	}).then(function() {
		res.json({
			code: 1,
			message: '更新成功'
		});
	}).catch(function(err) {
		console.log('标签更新失败:' + err);
		if(err.code) {
			return res.json({
				code: err.code,
				message: err.message
			});
		}
		next(err);
	});
}

//删除标签
exports.remove=function(req,res,next){
	let id = req.params['id'];
	Tag.remove({
		_id: id
	}).exec(function(err) {
		res.json({
			code: 1,
			message: '删除成功'
		});
	});
}

