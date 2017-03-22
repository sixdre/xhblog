"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Category=mongoose.model("Category");					//文章标签						
const async = require('async');

/*
 * getCategory 获取Category
 */
exports.getCategory=function(req,res,next){
	Category.find({}).exec(function(err,categorys){
		res.json({
			categorys:categorys
		});
	});
}

/*
 *postCategory  提交Category保存Category
 *
 */
exports.postCategory=function(req,res,next){
	let category=req.body.category,
		id=category._id,
		name=category.name;
	let _category=new Category(category);
	if(id){						//类型更新
		Category.update({_id:id},{name:name}).exec(function(err,category){
			res.json({
				code:2,
				message:'修改成功',
				category:category
			});
		});
	}else{					//新添加
		Category.findOne({name:category.name}).exec(function(err,category){
			if(category){
				res.json({
					code:-1,
					message:'已有此类型'
				});
			}else{
				_category.save(function(err,doc){
					if(err){
						return console.log('文章分类添加失败:'+err);
					}
					res.json({
						code:1,
						category:doc
					})
				});
			}
		});
	}
}

/*
 * removeCategory  删除Category
 */
exports.removeCategory=function(req,res,next){
	let id=req.body.category._id;
	Category.remove({_id:id}).exec(function(err){
		res.json({
			code:1
		});
	});
}