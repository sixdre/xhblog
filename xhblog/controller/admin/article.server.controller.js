"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');			//文章
const Category=mongoose.model("Category");
const Tag=mongoose.model('Tag');
const multiparty =require("connect-multiparty")
const formidable = require('formidable');
const fs = require('fs'); 							//node.js核心的文件处理模块
const multer = require ('multer');  //上传文件中间件 multer
const md5 = require('md5');
//设置上传的目录，  
//这里指定了一个临时目录（上传后的文件均保存到该目录下），  
//真正开发是一般加入path模块后使用path.join(__dirname,'temp');  
//var upload = multer({ dest:  "public/upload" });  
const storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: "public/upload/"+moment(Date.now()).format('YYYY-MM'),
    limits: {
	    fileSize: 100000000
	},
    //TODO:文件区分目录存放
    //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function (req, file, cb) {
    	console.log(file);
        let fileFormat =(file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象。
const upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
}).single("img");

module.exports={
	sub:function(req,res){
		upload(req, res, function (err) {
			if(err){
				return console.log("upload err:",err)
			}
			if(!req.file){
				res.json({
					code:-2
				});
				return ;
			}
			let article =new Article({
				author: "xuhao",
				title:req.body.article_title,
				type: req.body.article_type,
				content:req.body.content,
				tagcontent:req.body.tagcontent,
				imgurl:req.file.destination.substring(6)+"/"+req.file.filename
			});
			article.save(function(err, article) {
				if(err){
					return console.log(err);
				}
				res.json({
					code:1
				});
			});
		});
	},
	publish:function(req,res){					//新的发布文章接口
		let article =new Article({
			author: req.session["manager"]||'xuhao',
			title:req.body.title,
			content:req.body.content,
			tagcontent:req.body.tagcontent,
			tags:req.body.tags
		});
		//promise 解决多个数据传志，可以定义一个空对象然后将数据传入到空对象中，再返回前台
		article.save().then(function(artDoc){
			return artDoc;
		}).then(function(artDoc){
			let category=new Category({
				name:req.body.type.name,
				articles:[artDoc._id]
			});
			Category.findOne({name:req.body.type.name}).then(function(cate){
				if(cate){	
					Category.update({'name':req.body.type.name}, {'$addToSet':{"articles":artDoc._id} },function(){
						artDoc.category=cate._id;
						artDoc.save(function(){
							res.json({
								code:1
							});
						});
					});
				}else{
					category.save(function(err,category){
						artDoc.category=category._id;
						artDoc.save(function(){
							res.json({
								code:1
							});
						});
					});
				}
			})
		}).catch(function(err){
			console.log('文章发布出错'+err);
		});
	},
	//文章列表
	list:function(req, res) {
		let query = Article.find({}).sort({"time": -1});
		
		/*Article.count({}).then(function(c){
			
		}).then(function(){
			query.find({},function(err,article){
		}).catch(function(err){
			console.log('查询文章列表出错:'+err)
		})*/
		
		
		Article.count({},function(err,c){
			query.find({},function(err,article){
				if(err){
					return console.dir(err);
				}
				res.json({
					article:article
				})
			})
		})
	},
	//文章分页显示
	page:function(req, res) {
		let current=parseInt(req.body.current)-1;
		let textCount=parseInt(req.body.textCount);
		let query = Article.find({}).sort({
			"create_time": -1
		}).skip(textCount*current).limit(textCount);
		
		let total;			//文章数量
		Article.count({}).then(function(len){
			total=len;
			return query.find({}).populate('category','name').exec()
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
	},
	/*
	 搜索文章
	 * */
	doSearch:function(req, res) {
		let title=req.body.title;
		Article.find({title:{$regex:''+title+''}},function(err,docs){		//模糊搜索
			if(err){
				return console.log(err)
			}else if(docs.length){
				res.json({
					code:1,
					results:docs,
					number:docs.length
				})
			}else{
				res.json({
					code:-1
				})
			}
		})
	},
	
	/*
	 * 文章删除
	 * */
	remove:function(req, res) {
		let id=req.body.id;
		Article.findByBId(id,function(doc1){
			Category.update({_id:doc1.category},{
				$pull:{"articles": doc1._id}
			}).then(function(raw){
				Article.remove({bId:id}).exec(function(err){
					if(err){
						return console.log(err);
					}
					res.json({
						code:1
					});
				});
			}).catch(function(err){
				console.log(err);
			});
		});
	},
	//编辑文章搜寻
	find:function(req,res){
		let id=req.body.id;
		Article.findOne({bId:id}).populate('category','name').exec(function(err,doc){
			res.json({
				article:doc
			})
		})
	},
	update:function(req,res){
		let id=req.body.id;
		let content=req.body.content;
		let tagcontent=req.body.tagcontent;
		Article.update({bId:id},{
			tagcontent:tagcontent,
			content:content,
			update_time:Date.now()
			},function(err){
			if(err){
				return console.log('update err :'+err)
			}
			res.json({
				code:1
			})
		})
	},
	
	del:function(req,res){			//多项删除
		console.log(req.body.ids);
		Article.find({bId:{$in:req.body.ids}}).then(function(docs){
			return Promise.all(docs.map(function(doc){
				return Category.update({_id:doc.category},{
					$pull:{"articles": doc._id}
				}).then(function(){
					return Article.remove({_id:doc._id}).then(function(){
						return 1;
					});		//返回promise对象
				});
			}));
		}).then(function(dd){
			//console.log(dd);		//1
			res.json({
				code:1
			});
		}).catch(function(err){
			console.log('文章批量删除失败:'+err);
		})
	},
	/*
	 * 文章分类加载
	 */
	categoryList:function(req,res){
		Category.find({}).exec(function(err,categorys){
			res.json({
				categorys:categorys
			});
		});
	},
	/*
	 * 
	 * 文章分类添加或更新
	 */
	categoryAdd:function(req,res){
		let category=req.body.category,
			id=category._id,
			name=category.name;
		var _category=new Category(category);
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
	},
	/*
	 * 
	 * 文章分类删除
	 */
	categoryRemove:function(req,res){
		let id=req.body.category._id;
		Category.remove({_id:id}).exec(function(err){
			res.json({
				code:1
			});
		});
	},
	/*
	 * 文章标签查询
	 * 
	 */
	tagList:function(req,res){
		Tag.find({}).exec(function(err,tags){
			res.json({
				tags:tags
			});
		});
	},
	/*
	 * 标签添加
	 */
	tagAdd:function(req,res){
		console.log(req.body.tag);
		let tag=req.body.tag,
		id=tag._id,
		name=tag.name;
		var _tag=new Tag(tag);
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
	},
	tagRemove:function(req,res){
		let id=req.body.tag._id;
		Tag.remove({_id:id}).exec(function(err){
			res.json({
				code:1
			});
		});
	},
	
	
	testUpload:function(req,res){
		/*console.log(req.files);
		console.log(req.files.file.path);
		var newPath = "public/upload/"+moment(Date.now()).format('YYYY-MM') ;
		console.log(newPath);
		fs.renameSync(req.files.file.path, newPath+"/"+req.files.file.name);*/

	}


}