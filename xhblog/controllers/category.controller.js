/*
 * 分类控制器
 */
"use strict";
const path = require('path');
const fs = require('fs');
const async = require('async');
const _ = require('underscore');
const mongoose = require('mongoose');

//数据模型
const Category = mongoose.model("Category");


//获取分类
exports.getCategories=function(req,res,next){
	Category.find({}).exec(function(err, categorys) {
		if(err){
			return next(err);
		}
		res.json({
			code: 1,
			categorys: categorys
		});
	});
}

//添加分类
exports.add=function(req,res,next){
	let category = req.body.category,
		name = category.name;
	let _category = new Category(category);

	Category.findOne({
		name: name
	}).then(function(cate) {
		if(cate) {
			throw {
				code: -1,
				message: '已有此类型,不可重复'
			}
		}
		return _category.save();
	}).then(function(category) {
		res.json({
			code: 1,
			category: category,
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


//更新分类
exports.update=function(req,res,next){
	let category = req.body.category,
		id = category._id,
		name = category.name;
	Category.findOne({
		name: name
	}).then(function(cate) {
		if(cate) {
			throw {
				code: -1,
				message: '已有此类型,不可重复'
			}
		}
		return Category.update({
			_id: id
		}, {
			name: name
		}).exec();
	}).then(function() {
		res.json({
			code: 1,
			message: '更新成功'
		});
	}).catch(function(err) {
		console.log('类型更新失败:' + err);
		if(err.code) {
			return res.json({
				code: err.code,
				message: err.message
			});
		}
		next(err);
	});
}

//删除分类
exports.remove=function(req,res,next){
	let id = req.params['id'];
	Category.remove({
		_id: id
	}).exec(function(err) {
		res.json({
			code: 1,
			message: '删除成功'
		});
	});
}

