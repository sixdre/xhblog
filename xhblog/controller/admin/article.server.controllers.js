//引入数据模型  
var mongoose=require('mongoose');
var Article = mongoose.model('Article');			//文章
var Manager = mongoose.model('Manager');			//管理员


var formidable = require('formidable');
var fs = require('fs'); 							//node.js核心的文件处理模块


module.exports={
	//文章
	showarticle:function(req, res) {
		var loginmanager = req.session["loginmanager"];
		Article.count({},function(err,c){
			res.render('admin/article/article', {
				title: '文章_个人博客后台管理系统',
				loginmanager: loginmanager||{},
				total:c
			});
		})
	},
	/*
	 文章编辑器
	 * */
	showeditor:function(req, res) {
		res.render('admin/article/editor')
	},
	/*
	 * 提交文章
	 * */
	submit_article:function(req, res) {
		var article = new Article({
			author: req.session["loginmanager"],
			title:req.body.title,
			type: req.body.type,
			content:req.body.content,
			tagcontent:req.body.tagcontent
		});
		article.save(function(err, article) {
			if(err){
				return console.log(err);
			}
			res.json({
				code:1,
			})
		});
	},
	sub:function(req,res){
		if (req.file) {
			var article = Article({
				author: req.session["loginmanager"].name,
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
	    }

	},
	//文章列表
	list:function(req, res) {
		var query = Article.find({}).sort({"time": -1}).skip(0).limit(5);
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
		query.find(function(err, docs) {
			if(!err){
				if(docs != '') {
					res.render('admin/article/article_page', {
						page: docs || {}
					});
				}else{
					res.json({
						code:-1
					})
				}
			}else{
				console.log("Something happend.");
			}
		})
	},
	/*搜索文章页面显示*/
	showsearch:function(req, res) {
		res.render('admin/article/article_search')
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
					results:docs
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
		var id=req.body.id;
		/*console.log(id)*/
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
	}


}