"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');			//文章
const Category=mongoose.model("Category");			//类型
const Banner = mongoose.model('Banner');			//轮播图
const User = mongoose.model('User');				//用户
const Lm = mongoose.model('Lm');				//留言
const Friend=mongoose.model("Friend");			//友链
const Comment=mongoose.model('Comment');		//评论
const async = require('async');
const events = require('events');				//事件处理模块
const path = require('path');
const tool =require('../utility/tool');
/*
 * app.use 可以在多个页面获取用户session
 */
app.use(function(req,res,next){
	let _user=req.session['User'];
	app.locals.user=_user;
	/*Category.find({}).exec(function(err,categorys){
		Friend.find({},function(err,friends){
			app.locals.friends=friends;
			app.locals.categorys=categorys;
		});
	});*/
	next();
});


/*
 	Object Indexs() 主页面访问
 * @params currentPage当前页面
 * @params pagesize要显示的列表个数
 * */



/*
 * showIndex  主页面和分页请求
 */

exports.showIndex=function(req,res,next){
	let currentPage=req.params["page"]?req.params["page"]:1;
	async.auto({
		banners:function(callback){
			console.log(123);
			Banner.find({}).sort({weight:-1}).limit(3).exec(function(err,banners){
				if(err){
					callback(err);
				}
				callback(null,banners);
			})
		},
		total:function(callback){
			Article.count({},function(err,total){	//所有文章
				callback(null,total);
			})
		},
		settings:function(callback){
			 tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
		        if (err) {
		        	callback(err);
		        } else {
		        	console.log(settings);
		        	callback(null,settings); 
		        }
		    });
		},
		articles:['settings',function(results,callback){
			let pageSize=parseInt(results.settings.PageSize);
			Article.find({}).skip((currentPage-1)*pageSize)
			.limit(pageSize).sort({create_time:-1})
			.populate('category','name')
			.populate('tags').exec(function(err,articles){
				callback(null,articles);
			})
		}],
		newArticle:function(callback){
			Article.findNew(1,function(newArticle){
				callback(null,newArticle);
			});
		},
		hot:function(callback){
			Article.findByHot(3,function(hot){
				callback(null,hot);
			})
		}
		
	},function(err,results){
		console.log(results);
		res.render('www/', {
			title: '个人博客首页',
			banners:results.banners,
			total:results.total,
			articles:results.articles,	//所有文章
			newArticle:results.newArticle[0],	//最新文章
			hot:results.hot,				//热门文章
			currentpage:currentPage,	//当前页码
			pagesize:results.settings.pageSize			//列表数
		});
	})
}






module.exports={
	showIndex:function(req, res,next) {
		let currentPage=req.params["page"]?req.params["page"]:1;
		async.auto({
			banners:function(callback){
				Banner.find({}).sort({weight:-1}).limit(3).exec(function(err,banners){
					if(err){
						callback(err);
					}
					callback(null,banners);
				})
			},
			total:function(callback){
				Article.count({},function(err,total){	//所有文章
					callback(null,total);
				})
			},
			settings:function(callback){
				 tool.getConfig(path.join(__dirname, '../config/settings.json'), function (err, settings) {
			        if (err) {
			        	callback(err);
			        } else {
			        	callback(null,settings); 
			        }
			    });
			},
			articles:['settings',function(results,callback){
				let pageSize=parseInt(results.settings.PageSize);
				Article.find({}).skip((currentPage-1)*pageSize)
				.limit(pageSize).sort({create_time:-1})
				.populate('category','name')
				.populate('tags').exec(function(err,articles){
					callback(null,articles);
				})
			}],
			newArticle:function(callback){
				Article.findNew(1,function(newArticle){
					callback(null,newArticle);
				});
			},
			hot:function(callback){
				Article.findByHot(3,function(hot){
					callback(null,hot);
				})
			}
			
		},function(err,results){
			console.log(results);
			res.render('www/', {
				title: '个人博客首页',
				banners:results.banners,
				total:results.total,
				articles:results.articles,	//所有文章
				newArticle:results.newArticle[0],	//最新文章
				hot:results.hot,				//热门文章
				currentpage:currentPage,	//当前页码
				pagesize:results.settings.pageSize			//列表数
			});
		})
	},
	showDetial:function(req,res,next){
		const bid=req.params["bid"];
		async.auto({			//智能控制
			doc:function(callback){
				Article.findByBId(bid,function(article){
					if(!article){			//没找到就发送一个404
						//return res.send(404, "Oops! We didn't find it");
						return next('404');
					}
					let opts = [{
			            path   : 'category',
			            select : 'name'
			        }];
					article.populate(opts,function(err,doc){
						Article.findBybIdUpdate(bid,function(){
							callback(null,doc);
						});
					});
				});
			},
			hot:function(callback){
				Article.findByHot(2,function(hot){
					callback(null,hot);
				});
			},
			nextArticle:function(callback){
				Article.findNext(bid,function(nextArticle){		//下一篇
					callback(null,nextArticle);
				});
			},
			prevArticle:function(callback){
				Article.findPrev(bid,function(prevArticle){		//上一篇
					callback(null,prevArticle);
				});
			},
			comments:["doc",function(results,callback){
				let articleId=results.doc._id;
				Comment.find({article:articleId})
				.populate('from','username')
				.populate('reply.from reply.to','username').exec(function(err,comments){
					callback(null,comments);
				});
			}]
			
		},function(err,results){
			res.render("www/detial",{
				article:results.doc,
				hot:results.hot,
				title:results.doc.title,
				nextArticle:results.nextArticle,
				prevArticle:results.prevArticle,
				comments:results.comments			//评论
			});
		});
	},
	showSearchResults:function(req,res){
		let title=req.query.wd;
		async.waterfall([
			function(callback){
				Article.findByTitle(title,function(articles){
					callback(null,articles);
				});
			},
		],function(err,articles){
			res.render("www/search_results",{
				articles:articles,
				title:'搜索结果'
			});
		});
	},
	category:function(req,res){
		let category_name=req.params.val;
		async.waterfall([
		       function(cb){
		    	   Category.findOne({name:category_name}).exec(function(err,category){
		    		   cb(null,category);
		    	   })
		       },function(category,cb){
		    	   Article.find({category:category._id}).populate('category','name').then(function(articles){
		    		   cb(null,category,articles);
					});
		       }
		  ],function(err,category,articles){
				res.render('www/category',{
					articles:articles,
					title:category_name+'——徐浩的个人博客'
				});
		})
	},
	about:function(req,res){
		res.render("www/about",{
			title:'关于我'
		})
	}

}