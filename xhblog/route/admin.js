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






//渲染后台管理页
router.get('/',function(req,res,next){
	res.render('admin', {
		title: '博客后台管理系统',
	});
})

//后台angular 请求数据路由
router.get('/loadData',function(req,res,next){
	let manager = req.session["manager"];
	async.parallel({
		lmdoc:function(callback){
			Lm.find({"meta.isRead":false}).populate('user','username').exec(function(err,lmdoc){
				if(err){
					callback(err);
				}
				callback(null,lmdoc);
			})
		},
		total:function(callback){
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
		res.json({
			manager:manager,	//管理员
			total:results.total,		//文章总数
			lmdoc:results.lmdoc,		//留言
			categorys:results.categorys,	//文章分类
			tags:results.tags			//文章标签
		});
	});
});

//后台登陆
router.post('/login',function(req,res,next){
	let email=req.body.email;
	let password=req.body.password;
	User.findOne({email:email}).then(function(manager){
		if(!manager||manager.isAdmin==false){
			res.json({code:-1});
		}else{
			if(manager.password == md5(password)){
				req.session["manager"] = manager;
				res.json({code : 1});
			}else{
				res.json({code : -2});
			}
		}
	}).catch(function(err){
		console.log('登陆出错:'+err)
	})
})


//后台注册
router.post('/regist',function(req,res,next){
	let manager = new User({
		username: req.body.name,
		email:req.body.email,
		password: md5(req.body.password)
	});
	User.findOne({isAdmin:true}).then(function(user1){
		if(user1){
			return res.json({
				code:-1,
				message:'已有超级管理员，不可重复创建'
			});
		}
		return user1;
	}).then(function(user1){
		User.findOne({email:req.body.email}).then(function(user2){
			if(user2){
				return res.json({
					code:-2,
					message:'该邮箱已被注册'
				});
			}
			manager.isAdmin=true;
			manager.save(function(err, manager) {
				if(err){
					return console.log(err);
				}
				res.json({
					code:1,
					message:'成功创建超级管理员！'
				})
			});
		})
	}).catch(function(err){
		console.log('注册失败:'+err)
	});
})

//后台退出
router.post('/logout',function(req,res,next){
	delete req.session["manager"];
	res.json({
		code : 1
	});
})


//发布新文章
router.post('/article/publish',function(req,res,next){
	let article=req.body;
	article['author']=req.session["manager"]||'徐小浩';
	let _article=new Article(article);
	let resArticle;
	//promise 解决多个数据传值，可以定义一个空对象然后将数据传入到空对象中，再返回前台
	 _article.save().then(function(article){
		 resArticle=article
		 return article;
	 }).then(function(rs){
		 let categoryId=rs.category;
		 return Category.update({_id:categoryId}, {'$addToSet':{"articles":rs._id} });
	 }).then(function(){
			res.json({
				code:1,
				article:resArticle
			});
	 }).catch(function(err){
		 console.log('文章发布出错'+err);
	 });
})

//获取文章
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
router.post('/article/page',function(req,res,next){
	let current=parseInt(req.body.current)-1;
	let textCount=parseInt(req.body.textCount);
	let query = Article.find({}).sort({
		"create_time": -1
	}).skip(textCount*current).limit(textCount);
	
	let total;			//文章数量
	Article.count({}).then(function(len){
		total=len;
		return query.find({}).populate('category','name').exec();
	}).then(function(results){
		if(results.length>0){		//找到文章
			return res.json({
				page:results,
				total:total
			});
		}
		res.json({		//没有更多文章
			code:-1
		});
		
	}).catch(function(err){
		console.log('文章分页查询出错:'+err);
	})
})


//编辑更新文章
router.post('/article/update',function(req,res,next){
	let newArticle=req.body,
		bId=newArticle.bId;
	Article.findOne({bId:bId}).then(function(article){
		let _article=_.extend(article,newArticle);
		return _article.save();
	}).then(function(rs){
		res.json({
			code:1
		});
	}).catch(function(err){
		console.log('更新文章失败:'+err);
	});

})

//删除文章 (单项)
router.post('/article/romoveOne',function(req,res,next){
	let bId=req.body.bId;
	Article.findOne({bId:bId}).then(function(article){
		return Category.update({_id:article.category},{$pull:{"articles": article._id}});
	}).then(function(){
		Article.remove({bId:bId}).then(function(){
			res.json({
				code:1
			});
		});
	}).catch(function(err){
		console.log('删除文章出错'+err);
	});
})


//删除文章 （多选)
router.post('/article/removeMulti',function(req,res,next){
	console.log(req.body.ids);
	Article.find({bId:{$in:req.body.ids}}).then(function(articles){
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
		console.log(dd);		//1
		res.json({
			code:1
		});
	}).catch(function(err){
		console.log('文章批量删除失败:'+err);
	})
})

// 文章搜寻(弹框)
router.post('/article/find',function(req,res,next){
	let id=req.body.id;
	Article.findOne({bId:id}).populate('category','name').exec(function(err,doc){
		res.json({
			article:doc
		});
	});
})

//根据标题来搜寻文章
router.post('/article/search',function(req,res,next){
	let title=req.body.title;
	Article.find({title:{$regex:''+title+''}},function(err,docs){
		if(err){
			return console.log(err)
		}else if(docs.length){
			res.json({
				code:1,
				results:docs,
				number:docs.length
			});
		}else{
			res.json({
				code:-1
			});
		}
	});
})


//获取友情链接数据 
router.get('/friend',function(req,res,next){
	Friend.find({}).sort({time:-1}).exec(function(err,doc){
		if(err){
			return console.dir(err);
		}
		res.json({
			code:1,
			doc:doc
		});
	})
});


//添加友情链接
router.post('/friend',function(req,res,next){
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
});

//删除友情链接
router.post('/friend/remove',function(req,res,next){
	Friend.remove({_id:req.body.id}).exec(function(err){
		if(err){
			return console.log(err);
		}
		res.json({
			code:1
		});
	})
});


//更新友情链接
router.post('/friend/update',function(req,res,next){
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
})

//获取category数据
router.get("/category",function(req,res,next){
	Category.find({}).exec(function(err,categorys){
		res.json({
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
})


//分类删除
router.post('/category/remove',function(req,res,next){
	let id=req.body.category._id;
	Category.remove({_id:id}).exec(function(err){
		res.json({
			code:1
		});
	});
})	

//获取标签数据
router.get('/tag',function(req,res,next){
	Tag.find({}).exec(function(err,tags){
		res.json({
			tags:tags
		});
	});
})

//新增标签
router.post('/tag',function(req,res,next){
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
})

//删除标签
router.post('/tag/remove',function(req,res,next){
	let id=req.body.tag._id;
	Tag.remove({_id:id}).exec(function(err){
		res.json({
			code:1
		});
	});
})


//首页banner图的添加

//删除标签
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
			imgAdress:req.file.destination.substring(6)+"/"+req.file.filename
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
					code:1
				});
			})
		}else{
			res.json({
				code:-1
			});
		}
	})
})














module.exports = router;











