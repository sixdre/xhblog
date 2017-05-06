"use strict";
//后台管理路由
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const async = require('async');
const multer = require ('multer');  //上传文件中间件 multer
const md5 = require('md5');
const _=require('underscore');
const mongoose=require('mongoose');
const tool=require('../utility/tool');

//数据模型
const Article = mongoose.model('Article');			//文章
const Category=mongoose.model("Category");
const Tag=mongoose.model('Tag');
const Banner=mongoose.model("Banner");		
const Friend=mongoose.model("Friend");
const User = mongoose.model('User');
const Lm = mongoose.model('Lm');

//验证中间件
const Auth=require('../middleware/auth');


const storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: "public/upload/banner/"+moment(Date.now()).format('YYYY-MM'),
    limits: {
	    fileSize: 100000000
		},
    //TODO:文件区分目录存放
    //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象。
const upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
}).single('banner');





//router.use(function(req,res,next){
//	if(!req.session["manager"]){
//		let err = new Error('错误');
//		err.status = 401;
//		next(err);
//		console.log(123);
////		return res.status(401).json({
//	
//});
//	}
//	next();
//})/

//后台angular 请求数据路由
router.get('/loadData',function(req,res,next){
	async.parallel({
		lmdoc:function(callback){
			Lm.find({"state.isRead":false}).populate('user','username').exec(function(err,lmdoc){
				if(err){
					callback(err);
				}
				callback(null,lmdoc);
			})
		},
		articleTotal:function(callback){
			Article.count({}).exec(function(err,total){
				if(err){
					callback(err);
				}
				callback(null,total);
			})
		},
		categorys:function(callback){
			Category.find({}).exec(function(err,categorys){
				if(err){
					callback(err);
				}
				callback(null,categorys);
			})
		},
		tags:function(callback){
			Tag.find({}).exec(function(err,tags){
				if(err){
					callback(err);
				}
				callback(null,tags);
			})
		}
	},function(err,results){
		if(err){
			next(err);
		}
		res.json({
			articleTotal:results.articleTotal,			//文章总数
			lmdoc:results.lmdoc,			//留言
			categorys:results.categorys,	//文章分类
			tags:results.tags				//文章标签
		});
	
	});
});



//留言
router.post('/word',function(req,res,next){
	let id=req.body.id,
		content=req.body.replyContent;
	Lm.update({_id:id},{$set:{
		"reply.user":req.session['manager']._id,
		"reply.content":content,
		"reply.replyTime":new Date(),
		"state.isRead":true,
		"state.isReply":true
	}}).exec(function(err){
		if(err){
			console.log(err);
			next(err);
		}
		res.json({
			code:1,
			message:'留言回复成功'
		});
	});
})

//文章发布
router.post('/article/publish',multer({storage: storage}).single('cover'),function(req,res,next){
	let article=req.body.article;
	article['author']=req.session["manager"].username||'徐小浩';
	if(req.file&&req.file.path){
		article.img=req.file.path.substring(6);
	}
	let _article=new Article(article);
	_article.save().then(function(article){
		return article;
	}).then(function(article){
		let categoryId=article.category;
		return Category.update({_id:categoryId}, {'$addToSet':{"articles":article._id} });
	}).then(function(){
		res.json({
			code:1,
			article:article
		});
	}).catch(function(err){
		console.log('文章发布出错'+err);
		next(err);
	});
		
})

//编辑更新文章
router.post('/article/update',multer({storage: storage}).single('file'),function(req,res,next){	//有问题待修复
	let newArticle=req.body;
	if(req.file&&req.file.path){
		newArticle.img=req.file.path.substring(6);
	}
	Article.findById(newArticle._id).then(function(article){
		console.log(article);
		let _article=_.extend(article,newArticle);
		console.log(_article);
		return _article.save();
	}).then(function(rs){
		res.json({
			code:1,
			article:rs,
			message:'更新成功'
		});
	}).catch(function(err){
		console.log('更新文章失败:'+err);
		next(err);
	});

})	
	
	
//发布新文章
//router.post('/article/publish',function(req,res,next){
//	let article=req.body;
//		article['author']=req.session["manager"].username||'徐小浩';
//	let _article=new Article(article);
//	let resArticle;
//	//promise 解决多个数据传值，可以定义一个空对象然后将数据传入到空对象中，再返回前台
//	 _article.save().then(function(article){
//		 resArticle=article
//		 return article;
//	 }).then(function(rs){
//		 let categoryId=rs.category;
//		 return Category.update({_id:categoryId}, {'$addToSet':{"articles":rs._id} });
//	 }).then(function(){
//			res.json({
//				code:1,
//				article:resArticle
//			});
//	 }).catch(function(err){
//		 console.log('文章发布出错'+err);
//		 next(err);
//	 });
//})


//获取所有文章
router.get('/article/getArticles',function(req,res,next){
	let query = Article.find({}).sort({"time": -1});
	query.find({},function(err,article){
		if(err){
			return console.dir(err);
		}
		res.json({
			article:article
		});
	});
})

//分页展示
router.get('/article/page',function(req,res,next){
	let currentPage=parseInt(req.query.currentPage)-1;
	let limit=parseInt(req.query.limit);
	let title=req.query.title||'';
	let flag=parseInt(req.query.flag)||0;
	let queryObj={
		title:{'$regex':title},
	}
	switch(flag){
		case 1:		//有效
		queryObj.isActive=true;
		queryObj.isDraft=false;
		break;
		case 2:		//无效
		queryObj.isActive=false;
		break;
		case 3:		//草稿
		queryObj.isDraft=true;
		break;
	}
//	if(flag==1){		//有效
//		queryObj.isActive=true;
//		queryObj.isDraft=false;
//	}else if(flag==2){	//无效
//		
//	}
	
	console.log(queryObj);
	let query = Article.find(queryObj)
		.sort({"create_time": -1}).skip(limit*currentPage).limit(limit);
		
	Article.count(queryObj).exec().then(function(total){
		return total;
	}).then(function(total){
		query.find({}).populate('category','name').exec().then(function(results){
			if(total>0){		//找到文章
				return res.json({
					results:results,
					total:total
				});
			}
			res.json({		//没有更多文章
				code:-1,
				message:'没有更多文章'
			});
		})
	}).catch(function(err){
		console.log('文章分页查询出错:'+err);
		next(err);
	})
})

//编辑文章根据id查找
router.get('/article/findById',function(req,res,next){
	let id=req.query.id;
	Article.findOne({_id:id}).populate('category').populate('tags').then(function(article){
		res.json({
			code:1,
			article:article,
			message:'success'
		})
		console.log(article);
	})
})



//删除文章 (单项)
router.post('/article/romoveOne',function(req,res,next){
	let id=req.body.id;
	Article.findById(id).then(function(article){
		return Category.update({_id:article.category},{$pull:{"articles": article._id}});
	}).then(function(){
		return Article.remove({_id:id});
	}).then(function(){
		res.json({
			code:1,
			message:'删除成功'
		});
	}).catch(function(err){
		console.log('删除文章出错'+err);
		next(err);
	});
})


//删除文章 （多选)
router.post('/article/removeMulti',function(req,res,next){
	console.log(req.body.ids);
	Article.find({_id:{"$in":req.body.ids}}).then(function(articles){
		return Promise.all(articles.map(function(article){
			return Category.update({_id:article.category},{
				$pull:{"articles": article._id}
			}).then(function(){
				return Article.remove({_id:article._id}).then(function(){	//返回promise对象
					return 1;	//返回下一个promise resolve 对象的值
				});				
			});
		}));
	}).then(function(dd){
		//console.log(dd);		//1
		res.json({
			code:1,
			message:'删除成功'
		});
	}).catch(function(err){
		console.log('文章批量删除失败:'+err);
		next(err);
	})
})



//根据标题来搜寻文章
router.get('/article/search',function(req,res,next){
	let title=req.query.title;
	Article.find({title:{$regex:''+title+''}}).then(function(articles){
		if(articles.length){
			res.json({
				code:1,
				results:articles,
				message:'找到相关文章'
			});
		}else{
			res.json({
				code:-1,
				message:'没有找到相关文章'
			});
		}
	}).catch(function(err){
		console.log('文章查询失败:'+err);
		next(err);
	});
})


//获取友情链接数据 
router.get('/friend',function(req,res,next){
	Friend.find({}).sort({"meta.update_time":-1}).then(function(friends){
		res.json({
			code:1,
			friends:friends
		});
	}).catch(function(err){
		console.log('友链获取失败:'+err);
		next(err);
	});
})


//添加友情链接
router.post('/friend',function(req,res,next){
	const id=req.body._id,
		title=req.body.title,
		url=req.body.url,
		sort=req.body.sort;
	if(id==undefined){			//说明是新增
		let friend=new Friend({
			title:title,
			url:url,
			sort:sort
		});
		Friend.findOne({title:title}).then(function(doc){
			if(doc){
				throw {
					code:-2,
					message:'该友链已经添加过了'
				}
			}
			return friend.save();
		}).then(function(doc){
			res.json({
				code:1,
				friend:doc,
				message:'添加成功'
			});
		}).catch(function(err){
			console.log('友链添加出错:'+err);
			if(err.code){
				return res.json({
					code:err.code,
					message:err.message
				})
			}
			next(err);
		})
	}else{						//更新
		Friend.update({_id:id},{
			"title":title,
			"url":url,
			"sort":sort,
			"meta.update_time":Date.now()
			}).then(function(){
				res.json({
					code:1,
					message:'更新成功'
				});
			}).catch(function(err){
				console.log('update err :'+err);
				next(err);
			});
	}
});

//删除友情链接
router.post('/friend/remove',function(req,res,next){
	let id=req.body.id
	Friend.remove({_id:id}).then(function(){
		res.json({
			code:1,
			message:'删除成功'
		});
	}).catch(function(err){
		console.log('友链删除失败:'+err);
		next(err);
	});
})



//获取category数据
router.get("/category",function(req,res,next){
	Category.find({}).exec(function(err,categorys){
		res.json({
			code:1,
			categorys:categorys
		});
	});
})

//分类添加
router.post("/category",function(req,res,next){
	let category=req.body.category,
		id=category._id,
		name=category.name;
	let _category=new Category(category);
	
	if(id){			//类型更新
		Category.findOne({name:name}).then(function(cate){
			if(cate){
				throw {
					code:-1,
					message:'已有此类型,不可重复'
				}
			}
			return Category.update({_id:id},{name:name}).exec();
		}).then(function(){
			res.json({
				code:2,
				message:'更新成功'
			});
		}).catch(function(err){
			console.log('类型更新失败:'+err);
			if(err.code){
				return res.json({
					code:err.code,
					message:err.message
				});
			}
			next(err);
		});
	}else{		//新添加
		Category.findOne({name:name}).then(function(cate){
			console.log(cate);
			if(cate){
				throw {
					code:-1,
					message:'已有此类型,不可重复'
				}
			}
			return _category.save();
		}).then(function(category){
			res.json({
				code:1,
				category:category,
				message:'添加成功'
			});
		}).catch(function(err){
			console.log('类型添加失败:'+err);
			if(err.code){
				return res.json({
					code:err.code,
					message:err.message
				})
			}
			next(err);
		});
	}
})


//分类删除
router.post('/category/remove',function(req,res,next){
	let id=req.body.id;
	Category.remove({_id:id}).exec(function(err){
		res.json({
			code:1,
			message:'删除成功'
		});
	});
})	

//获取标签数据
router.get('/tag',function(req,res,next){
	Tag.find({}).exec(function(err,tags){
		res.json({
			code:1,
			tags:tags
		});
	});
})

//新增标签
router.post('/tag',function(req,res,next){
	console.log(req.body.tag);
	let _tag=req.body.tag,
		id=_tag._id,
		name=_tag.name;
	let newtag=new Tag(_tag);
	
	if(id){			//类型更新
		Tag.findOne({name:name}).then(function(tag){
			if(tag){
				throw {
					code:-1,
					message:'已有此标签,不可重复'
				}
			}
			return Tag.update({_id:id},{name:name}).exec();
		}).then(function(){
			res.json({
				code:2,
				message:'更新成功'
			});
		}).catch(function(err){
			console.log('标签更新失败:'+err);
			if(err.code){
				return res.json({
					code:err.code,
					message:err.message
				});
			}
			next(err);
		});
	}else{				//新添加
		Tag.findOne({name:name}).then(function(tag){
			if(tag){
				throw {
					code:-1,
					message:'已有此标签,不可重复'
				}
			}
			return newtag.save();
		}).then(function(tag){
			res.json({
				code:1,
				tag:tag,
				message:'添加成功'
			});
		}).catch(function(err){
			console.log('类型添加失败:'+err);
			if(err.code){
				return res.json({
					code:err.code,
					message:err.message
				})
			}
			next(err);
		});
	}
})

//删除标签
router.post('/tag/remove',function(req,res,next){
	let id=req.body.tag._id;
	Tag.remove({_id:id}).exec(function(err){
		res.json({
			code:1,
			message:'删除成功'
		});
	});
})


//获取注册用户
router.get('/users',function(req,res,next){
	console.log('123');
	User.findAll().then(function(users){
		res.json({
			code:1,
			users:users,
			message:'获取用户列表成功'
		})
	}).catch(function(err){
		console.log('查询用户列表出错:'+err);
		next(err);
	})
})









//首页banner图的添加

router.post('/banner',function(req,res,next){
	upload(req, res, function (err) {
		if(err){
			return console.log("upload err:",err);
		}
		console.log(req.file)
		if(!req.file){
			res.json({
				code:-2
			});
			return ;
		}
		let banner = Banner({
			dec:req.body.dec,
			url: req.body.link,
			weight:req.body.weight,
			imgAdress:req.file.path.substring(6)
//			imgAdress:req.file.destination.substring(6)+"/"+req.file.filename
		});
		
		let nameArray=req.file.originalname.split('.')
		let type=nameArray[nameArray.length-1];
		
		let typeArray=["jpg","png","gif","jpeg"];

		if(tool.contain(typeArray,"jpg")&&tool.checkUrl(req.body.link)&&req.body.dec.length){
		
			banner.save(function(err,doc){
				if(err){
					return console.log("banner save err:",err);
				}
				res.json({
					code:1,
					message:'添加成功'
				});
			})
		}else{
			res.json({
				code:-1,
				message:'添加失败'
			});
		}
	})
})

module.exports = router;











