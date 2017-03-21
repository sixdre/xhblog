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
var events = require('events');				//事件处理模块

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
	});
	next();*/
	next();
});


/*
 	Object Indexs() 主页面访问
 * @params currentPage当前页面
 * @params pagesize要显示的列表个数
 * */
var Indexs=function(req,res,currentPage,pageSize){
	async.waterfall([
		function(callback){
			Banner.find({}).sort({weight:-1}).limit(3).exec(function(err,banners){
				if(err){
					return console.log("banner find err:",err)
				}
				callback(null,banners);
			})
		},
		function(banners,callback){
			Article.count({},function(err,total){	//所有文章
				Article.find({}).skip((currentPage-1)*pageSize).limit(pageSize).sort({create_time:-1}).populate('category','name').exec(function(err,articles){
					callback(null,banners,total,articles);
				})
			});
		},
		function(banners,total,articles,callback){		//最新文章
			Article.findNew(1,function(newArticle){
				callback(null,banners,total,articles,newArticle);
			});
		},
		function(banners,total,articles,newArticle,callback){		//热门文章
			Article.findByHot(3,function(hot){
				callback(null,banners,total,articles,newArticle,hot);
			})
		},
		/*function(banner,total,doc,newart,hot,callback){
			/*Article.find({}).populate('category').exec(function(err,ddc){
				console.log(ddc);
			});*/
			
			/*Article.aggregate([{$group : {_id:"$type", total : {$sum : 1}}}],function(err,types){
				if(err){
					return console.dir(err);		
				}
				callback(null,banner,total,doc,newart,hot,types);*/
				/*前台页面导航
				<%types.forEach(function(v,i){%>
				<li>
					<a href="/type/<%=v._id%>"><%=v._id%> <span><%=v.total%></span></a>
				</li>
				<%})%>*/
			/*})*/
			/*Category.find({}).exec(function(err,categorys){
				callback(null,banner,total,doc,newart,hot,categorys);
			})
		},*/
	],function(err,banners,total,articles,newArticle,hot){
		res.render('www/', {
			title: '个人博客首页',
			banners:banners,
			total:total,
			articles:articles,	//所有文章
			newArticle:newArticle[0],	//最新文章
			hot:hot,				//热门文章
			currentpage:currentPage,	//当前页码
			pagesize:pageSize			//列表数
		});
	});
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
		//查询不同类型文章的数量
		/*Article.aggregate([{$group : {_id:"$category", total : {$sum : 1}}}],function(err,types){
			var cartshop = [];
			var obj ;
			var j = 0;
			var myEventEmitter = new events.EventEmitter();
			myEventEmitter.on('next',addResult);
			function addResult() {
			    cartshop.push(obj);
			    j++;
			    if(j==types.length){
			    	console.log(1);
			        console.log(cartshop);		//查询到了
			    }
			}
			if(err){
				return console.dir(err);		
			}
			types.forEach(function(rst,i){
				Category.findOne({_id:rst._id}).exec(function(err,cate){
					 if(err){
				        return next(err);
				    }else{
				    	rst.name=cate.name;
				        obj = rst;
				        myEventEmitter.emit('next');
				    }
				})
			})
		})*/
		
		Category.find({}).exec(function(err,categorys){
			Friend.find({}).exec(function(err,friends){
				app.locals.friends=friends;
				app.locals.categorys=categorys;
			});
		});
		next();
	},
	showIndex:function(req, res) {
		const pageNum=req.params["page"]?req.params["page"]:1;
		Indexs(req,res,pageNum,3);
	},
	showDetial:function(req,res){
		const bid=req.params["bid"];
		async.waterfall([
			function(callback){
				Article.findByBId(bid,function(article){
					if(!article){			//没找到就发送一个404
						return res.send(404, "Oops! We didn't find it");
					}
					let opts = [{
			            path   : 'category',
			            select : 'name'
			        }];
					article.populate(opts,function(err,doc){
						Article.findByIdUpdate(bid,function(){
							callback(null,doc);
						});
					});
				});
			},
			function(doc,callback){
				Article.findByHot(2,function(hot){
					callback(null,doc,hot);
				});
			},
			function(doc,hot,callback){
				Article.findOne({bId:{'$gt':bid}},function(err,nextArticle){
					if(err){
						console.log(err)
					}
					callback(null,doc,hot,nextArticle);
				});
			},
			function(doc,hot,nextArticle,callback){
				Article.findOne({bId:{'$lt':bid}},function(err,prevArticle){
					if(err){
						console.log(err)
					}
					callback(null,doc,hot,nextArticle,prevArticle);
				});
			},
			function(doc,hot,nextArticle,prevArticle,callback){
				Comment.find({article:doc._id}).populate('from','username').populate('reply.from reply.to','username').exec(function(err,comments){
					callback(null,doc,hot,nextArticle,prevArticle,comments);
				});
			}
			
		],function(err,doc,hot,nextArticle,prevArticle,comments){
			res.render("www/detial",{
				article:doc,
				hot:hot,
				title:doc.title,
				nextArticle:nextArticle,
				prevArticle:prevArticle,
				comments:comments			//评论
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
		Category.findOne({name:category_name}).then(function(category){
			Article.find({category:category._id}).populate('category','name').then(function(articles){
				console.log(articles);
				res.render('www/category',{
					articles:articles,
					title:category_name+'——徐浩的个人博客'
				});
			});
		}).catch(function(){
			
		});
	},
	about:function(req,res){
		res.render("www/about",{
			title:'关于我'
		})
	}

}