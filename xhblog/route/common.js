"use strict";
//引入数据模型  
const mongoose = require('mongoose');
const Article = mongoose.model('Article'); //文章
const Category = mongoose.model("Category"); //类型
const Friend = mongoose.model("Friend"); //友链

const async = require('async');
const events = require('events'); //事件处理模块
const tool = require('../utility/tool');
const path = require('path');

/*
 * 加载网站公共的数据（页面导航，友情链接 
 */
exports.loadCommonData = function(req, res, next) {
	//查询不同类型文章的数量new
	let categorys = [];
	let obj;
	let j = 0;
	let myEventEmitter = new events.EventEmitter();
	async.auto({
		friends: function(cb) {
			Friend.find({}).sort({'sort': -1}).exec(function(err, friends) {
				if(err){
					return cb(err);
				}
				cb(null, friends)
			});
		},
		types: function(cb) {
			Article.aggregate([{$group: {_id: "$category",total: {$sum: 1}}}]).exec(function(err, types) {
				if(err){
					return cb(err);
				}
				cb(null, types);
			});
		},
		categorys: ["types", function(results, cb) { //分类下的文章数量统计
			if(!results.types.length){
				cb(null, []);
				return ;
			}
			async.eachSeries(results.types,function(type,cb){
				Category.findById(type._id).exec(function(err, cate) {
					if(err){
						return cb(err);
					}
					type.name = cate.name;
					categorys.push(type);
					cb(null,categorys)
				})
			},function(err,results){
				if(err){
					return cb(err)
				}
				cb(null,categorys)
			})
//			results.types.forEach(function(type) {
//				Category.findOne({_id: type._id}).exec(function(err, cate) {
//					if(err){
//						cb(err);
//					}else if(cate){
//						type.name = cate.name;
//					}else{
//						type.name = "null";
//					}
//					obj = type;
//					myEventEmitter.emit('next');
//				});
//			});
//			function addResult() {
//				categorys.push(obj);
//				j++;
//				if(j == results.types.length) {
//					cb(null, categorys);
//				}
//			}
//			myEventEmitter.on('next', addResult);
		}]
}, function(err, results) {
		if(err){
			return res.status(500).json({
				message:'获取网站基本数据出错'
			})
		}
		app.locals.friends = results.friends; //友链
		app.locals.categorys = results.categorys; //根据文章类型同计数量
		app.locals.settings = CONFIG; //获取网站设置
		next();
	})
}