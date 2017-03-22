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



/*
 * publish 文章发布
 */
exports.publish=function(req,res,next){
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
}

/*
 * list 文章列表
 */
exports.list=function(req,res,next){
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
}
/*
 * page 分页
 */
exports.page=function(req,res,next){
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
}

/*
 * search 文章搜索（根据文章标题)
 */
exports.search=function(req,res,next){
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
}

/*
 * remove 文章删除(单项)
 */
exports.remove=function(req,res,next){
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
}

/*
 * del 文章删除（多选）
 */
exports.del=function(req,res,next){
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
}


/*
 * 文章搜寻(弹框)
 */
exports.find=function(req,res,next){
	let id=req.body.id;
	Article.findOne({bId:id}).populate('category','name').exec(function(err,doc){
		res.json({
			article:doc
		})
	})
}

/*
 * update 文章更新
 */
exports.update=function(req,res,next){
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
}
