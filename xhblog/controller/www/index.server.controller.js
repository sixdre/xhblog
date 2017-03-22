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
var Indexs=function(req,res,currentPage,pageSize){
	
	async.parallel({
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
		articles:function(callback){
			Article.find({}).skip((currentPage-1)*pageSize)
			.limit(pageSize).sort({create_time:-1})
			.populate('category','name')
			.populate('tags').exec(function(err,articles){
				callback(null,articles);
			})
		},
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
		res.render('www/', {
			title: '个人博客首页',
			banners:results.banners,
			total:results.total,
			articles:results.articles,	//所有文章
			newArticle:results.newArticle[0],	//最新文章
			hot:results.hot,				//热门文章
			currentpage:currentPage,	//当前页码
			pagesize:pageSize			//列表数
		});
	})
}


module.exports={
	checkLoginByAjax:function(req,res,next){		//对ajax请求来进行用户状态判断
		if(!req.session["User"]){
	       return res.json({
	    	   code:-2
	       });
	    }
		next();
	},
	checkLoginByNative:function(req,res,next){		//对链接跳转请求来进行用户状态判断
		if(!req.session["User"]){
			return res.redirect('login');
		}
		next();
	},
	common:function(req,res,next){
		//查询不同类型文章的数量new
		let categorys = [];
		let obj ;
		let j = 0;
		let myEventEmitter = new events.EventEmitter();
		async.auto({
			friends:function(cb){
				 Friend.find({}).exec(function(err,friends){
					  cb(null,friends)
				 });
			},
			types:function(cb){
				 Article.aggregate([{$group : {_id:"$category", total : {$sum : 1}}}]).exec(function(err,types){
					  cb(null,types);
				 });
			},
			categorys:["types",function(tt,cb){
				 myEventEmitter.on('next',addResult);
				  function addResult() {
					   categorys.push(obj);
					    j++;
					    if(j==tt.types.length){
					    	cb(null,categorys);
					    }
				  }
				  tt.types.forEach(function(rst,i){
						Category.findOne({_id:rst._id}).exec(function(err,cate){
							rst.name=cate.name;
					        obj = rst;
					        myEventEmitter.emit('next');
						});
				   });
			}]
		},function(err,results){
			 app.locals.friends=results.friends;		//友链
			 app.locals.categorys=results.categorys;	//根据文章类型同计数量
		})
		next();
	},
	showIndex:function(req, res) {
		const pageNum=req.params["page"]?req.params["page"]:1;
		Indexs(req,res,pageNum,3);
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
	showLogin:function(req,res){
		res.render("www/login",{
			title:"用户登录"
		});
	},
	showRegist:function(req,res){
		res.render("www/regist",{
			title:"用户注册"
		});
	},
	doLogin:function(req,res){
		let username=req.body.username,
		  password=req.body.password,
		  ref=req.query.ref,
		  articleId=req.query.articleId;
		if(validator.isEmpty(username)){
			res.json({
				code:-2,
				message:"请输入用户名！"
			});
		}else if(validator.isEmpty(password)){
			res.json({
				code:-2,
				message:"请输入密码！"
			});
		}else{
			User.findOne({username:username},function(err,user){
				if(err){
					return console.dir("查询出错");
				}else if(!user){
					res.json({
						code:-1,
						message:"该用户没有注册！"
					})
				}else if(user&&user.password!==md5(password)){
					res.json({
						code:0,
						message:"用户密码不正确！"
					})
				}else{
					req.session["User"] = user;
					res.json({
						code:1,
						message:"登录成功！",
						ref:ref,
						articleId:articleId
					});
					
				}
			})	
		}
	},
	doRegist:function(req,res){
		let username=req.body.username,
			  password=req.body.password,
			  email=req.body.email;
		let user=new User({
			username:username,
			password:md5(password),
			email:req.body.email
		});
		if(validator.isEmpty(username)){
			res.json({
				code:-2,
				message:"用户名不得为空！"
			});
		}else if(validator.isEmpty(password)){
			res.json({
				code:-2,
				message:"密码不得为空！"
			});
		}else if(validator.isEmpty(email)){
			res.json({
				code:-2,
				message:"邮箱不得为空！"
			});
		}else if(!validator.isEmail(email)){
			res.json({
				code:-2,
				message:"请输入正确的邮箱！"
			});
		}else if(!validator.isLength(password,{min:3})){
			res.json({
				code:-2,
				message:"密码不得小于3位！"
			});
		}else{
			User.findOne({username:username},function(err,result){
				if(err){
					return console.dir("查询出错");
				}else if(result){
					res.json({
						code:-1,
						message:"用户名已被创建"
					});
				}else{
					user.save(function(err){
						if(err){
							return console.dir("保存用户出错");
						}
						res.json({
							code:1,
							message:"成功注册"
						});
					});
				}
			});
		}
	},
	logout:function(req,res){
		delete req.session['User'];
		delete app.locals.user;
		res.json({
			code:1
		});
	},
	postComment:function(req,res){
		let _comment=req.body;
		_comment.from=req.session["User"];
		if(_comment.cId){
			let reply={
				from:_comment.from._id,
				to:_comment.toId,
				content:_comment.content
			};
			Comment.update({_id:_comment.cId},{
				$addToSet:{"reply": reply}
			}).then(function(){
				res.json({
					code:1
				});
			}).catch(function(err){
				console.log(err);
			});
			
			/*Comment.findOne({_id:_comment.cId},function(err,comment){
				let reply={
					from:_comment.from,
					to:_comment.toId,
					content:_comment.content,
					create_time:Date.now()
				};
				comment.reply.push(reply);
				comment.save(function(err,comment){
					res.json({
						code:1
					});
				})
				
			})*/
		}else{
			let comment=new Comment(_comment);
			comment.save().then(function(comment){
				res.json({
					code:1
				});
			}).catch(function(err){
				console.log('评论报错出错:'+err);
			});
		}
	},
	showWord:function(req,res){
		res.render("www/word",{
			title:'留言'
		});
	},
	postWord:function(req,res){
		let lm=new Lm({
			message:req.body.content,
			user:req.session["User"]._id
		});
		lm.save(function(err){
			if(err){
				return console.dir("留言失败:"+err)
			}
			res.json({
				code:1
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