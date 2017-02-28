//引入数据模型  
var mongoose=require('mongoose');
var Article = mongoose.model('Article');			//文章
var Manager = mongoose.model('Manager');			//管理员


var formidable = require('formidable');
var fs = require('fs'); 							//node.js核心的文件处理模块

var multer = require ('multer');  //上传文件中间件 multer
var md5 = require('md5');
//设置上传的目录，  
//这里指定了一个临时目录（上传后的文件均保存到该目录下），  
//真正开发是一般加入path模块后使用path.join(__dirname,'temp');  
//var upload = multer({ dest:  "public/upload" });  
var storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: "public/upload/"+moment(Date.now()).format('YYYY-MM'),
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
var upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
}).single('resource');

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
			var article = Article({
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
			var article = Article({
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
	//文章列表
	list:function(req, res) {
		var query = Article.find({}).sort({"time": -1});
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
		var current=parseInt(req.body.current)-1;
		var textCount=parseInt(req.body.textCount);
		var query = Article.find({}).sort({
			"time": -1
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
		var title=req.body.title;
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
		const id=req.body.id;
		console.log(id);
		Article.remove({bId:id},function(err,docs){
			
			if(err){
				return console.log(err)
			}else{
				res.json({
					code:1
				})
			}
		})
	},
	//编辑文章搜寻
	find:function(req,res){
		const id=req.body.id;
		console.log(id);
		Article.findById(id,function(doc){
			res.json({
				article:doc
			})
		})
	},
	update:function(req,res){
		const id=req.body.id;
		const content=req.body.content;
		const tagcontent=req.body.tagcontent;
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
		Article.remove({bId:{$in:req.body.ids}})
	    .then(function(){
	        res.json({code:1})
	    })
	}


}