"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Tag=mongoose.model("Tag");					//文章标签						
const async = require('async');

/*
 * getTag 获取tag
 */
exports.getTags=function(req,res,next){
	Tag.find({}).exec(function(err,tags){
		res.json({
			tags:tags
		});
	});
}

/*
 *postTag  提交tag保存tag
 *
 */
exports.postTag=function(req,res,next){
	console.log(req.body.tag);
	let tag=req.body.tag,
	id=tag._id,
	name=tag.name;
	let _tag=new Tag(tag);
	if(id){						//类型更新
		Tag.update({_id:id},{name:name}).exec(function(err,tag){
			res.json({
				code:2,
				message:'修改成功',
				tag:tag
			});
		});
	}else{					//新添加
		Tag.findOne({name:tag.name}).exec(function(err,tag){
			if(tag){
				res.json({
					code:-1,
					message:'已有此类型'
				});
			}else{
				_tag.save(function(err,doc){
					if(err){
						return console.log('文章分类添加失败:'+err);
					}
					res.json({
						code:1,
						tag:doc
					})
				});
			}
		});
	}
}

/*
 * deleteTag  删除tag
 */
exports.deleteTag=function(req,res,next){
	let id=req.body.tag._id;
	Tag.remove({_id:id}).exec(function(err){
		res.json({
			code:1
		});
	});
}
















