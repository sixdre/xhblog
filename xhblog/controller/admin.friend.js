"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Friend=mongoose.model("Friend");					//文章标签						
const async = require('async');

/*
 * getFriends 获取Friends
 */
exports.getFriends=function(req,res,next){
	Friend.find({}).sort({time:-1}).exec(function(err,doc){
		if(err){
			return console.dir(err);
		}
		res.json({
			code:1,
			doc:doc
		});
	})
}

/*
 *postFriend  提交Friend保存Friend
 *
 */
exports.postFriend=function(req,res,next){
	let id=req.body._id,
	title=req.body.title,
	url=req.body.url,
	logo=req.body.logo,
	sort=req.body.sort;
	if(id==undefined){			//说明是新增
		let friend=new Friend({
			title:req.body.title,
			url:req.body.url,
			logo:req.body.logo,
			sort:req.body.sort
		});
		Friend.findByTitle(title,function(err){
			if(err){
				return res.json({
					code:-1
				});
			}
			friend.save().then(function(doc){
				res.json({
					code:1,
					friend:doc
				});
			}).catch(function(err){
				return console.log('添加失败 err：'+err);
			});
		})
		
	}else{						//更新
		Friend.update({_id:id},{
			title:title,
			url:url,
			logo:logo,
			sort:sort,
			update_time:Date.now()
			}).then(function(){
				res.json({
					code:1
				});
			}).catch(function(err){
				return console.log('update err :'+err);
			});
	}
}

/*
 * removeFriend  删除Friend
 */
exports.removeFriend=function(req,res,next){
	Friend.remove({_id:req.body.id}).exec(function(err){
		if(err){
			return console.log(err);
		}
		res.json({
			code:1
		});
	})
}

/*
 *updateFriend  友情链接更新
 * */
exports.updateFriend=function(req,res){
	let id=req.body._id,
		title=req.body.title,
		url=req.body.url,
		logo=req.body.logo,
		sort=req.body.sort;
	Friend.update({_id:id},{
		title:title,
		url:url,
		logo:logo,
		sort:sort,
		update_time:Date.now()
		}).then(function(){
			res.json({
				code:1
			});
		}).catch(function(err){
			return console.log('update err :'+err);
		});
	
}















