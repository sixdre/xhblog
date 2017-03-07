"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');			//文章
const Category=mongoose.model("Category");

const Manager = mongoose.model('Manager');				//管理员

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
					return console.log(err)
				}
				res.json({
					code:1
				})
			});
		});
		
		
		
		/*if (req.file) {
			let article = Article({
				author: "xuhao",
				title:req.body.article_title,
				type: req.body.article_type,
				content:req.body.content,
				tagcontent:req.body.tagcontent,
				imgurl:req.file.destination.substring(6)+"/"+req.file.filename
			});
			article.save(function(err, article) {
				if(err){
					return console.log(err)
				}
				res.json({
					code:1
				})
			});
	    }*/

	},
	publish:function(req,res){					//新的发布文章接口
			let tags=[req.body.tag1,req.body.tag2];
			let article =new Article({
				author: req.session["manager"]||'xuhao',
				title:req.body.title,
				type: req.body.type.value,
				content:req.body.content,
				tagcontent:req.body.tagcontent,
				tags:tags
			});
			console.log(tags);
			article.save().then(function(artDoc){
				console.log(artDoc);
				let category=new Category({
					name:req.body.type.value,
					articles:[artDoc._id]
				});
				Category.findByName(req.body.type.value,function(err,cate){
					if(err){
						return console.log(err)
					}
					else if(cate){	
						Category.update({'name':req.body.type.value}, {'$addToSet':{"articles":artDoc._id} },function(){
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
				});
			}).catch(function(err){
				console.log('文章发布出错'+err);
			});

			/*article.save(function(err,artDoc) {
				if(err){
					return console.log(err);
				}
				var category=new Category({
					name:req.body.type.value,
					articles:[artDoc._id]
				});
				
				Category.findByName(req.body.type.value,function(err,cate){	//由于文章类型唯一，首先要判断类型模型中有没有当前类型
					if(err){
						return console.log(err)
					}
					else if(cate){					//有的话就将当前文章添加到类型中
						cate.articles.push(artDoc._id);
						artDoc.category=cate._id;
						cate.save(function(err){
							artDoc.save(function(err){
								if(err){
									return console.log(err);
								}
								res.json({
									code:1
								});
							});
						});
					}else{
						category.save(function(err,catDoc){
							if(err){
								return console.log(err);
							}
							artDoc.category=catDoc._id;
							artDoc.save(function(err){
								if(err){
									return console.log(err);
								}
								res.json({
									code:1
								});
							});
						});
					}
				});
			});*/
	},
	//文章列表
	list:function(req, res) {
		let query = Article.find({}).sort({"time": -1});
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
		Article.count({},function(err,total){
			query.find(function(err, docs) {
				if(!err){
					if(docs != '') {
						res.json({
							page:docs,
							total:total
						});
					}else{
						res.json({
							code:-1
						});
					}
				}else{
					console.log("Something happend.");
				}
			})
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
		console.log(id);
		Article.findById(id,function(doc1){
			console.log(doc1.category);
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
			/*.then(function(doc){
				console.log(doc);
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
			});*/
			
			/*Category.findOne({_id:doc1.category},function(err,doc2){
				var len=doc2.articles.indexOf(doc1._id);
				doc2.articles.splice(len,1);
				console.log(doc2);
				doc2.save(function(){
					Article.remove({bId:id},function(err){
						if(err){
							return console.log(err);
						}
						res.json({
							code:1
						});
					});
				});
			});*/
		});
	},
	//编辑文章搜寻
	find:function(req,res){
		let id=req.body.id;
		Article.findById(id,function(doc){
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
	
	del:function(req,res){
		console.log(req.body.ids);
		Article.find({bId:{$in:req.body.ids}}).then(function(doc){
			console.log(doc);
			doc.forEach(function(v,i){
				console.log(v);
				Category.update({_id:v.category},{
					$pull:{"articles": v._id}
				}).then(function(raw){
					console.log(123);
					Article.remove({bId:v.bId}).exec(function(err){
						if(err){
							return console.log(err);
						}
					});
				}).catch(function(err){
					console.log(err);
				});
			});
			console.log(123455);
			res.json({
				code:1
			});
		}).catch(function(err){
			console.log('查询出错'+err);
		});
		/*Article.remove({bId:{$in:req.body.ids}})
	    .then(function(){
	        res.json({code:1})
	    })*/
	},
	testUpload:function(req,res){
		/*console.log(req.files);
		console.log(req.files.file.path);
		var newPath = "public/upload/"+moment(Date.now()).format('YYYY-MM') ;
		console.log(newPath);
		fs.renameSync(req.files.file.path, newPath+"/"+req.files.file.name);*/

	}


}