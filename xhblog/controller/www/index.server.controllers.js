//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');			//文章
const Banner = mongoose.model('Banner');			//轮播图
const User = mongoose.model('User');				//用户
const async = require('async');
//var shoppingModel = global.dbHandle.getModel('shopping');

/*var events = require('events');

var cartsshop = [];
var obj;
var j = 0;
var myEventEmitter = new events.EventEmitter();
myEventEmitter.on('next', addResult);


var carts=[1,'dwsd',5]*/
/*function addResult() {
	cartsshop.push(obj);
	j++;
	if(j == carts.length) {
		console.log(cartsshop);
		res.json(cartsshop);
	}
}
for(var i = 0; i < carts.length; i++) {
	var ii = i;
	Article.findOne({
		title: carts[ii]
	}, function(err, shops) {
		if(err) {
			return next(err);
		} else {
			obj = shops;
			myEventEmitter.emit('next');
		}
	});
}*/
/*Words.aggregate([{$match: {last:{$in:['a','e','i','o','u']}}},{$group:{_id:"$first", largest:{$max:"$size"}, smallest: {$min:"$size"}}}, {$sort:{_id: -1}}], function(err, results){
        console.log("\nLargest aned samllest word sizes for words beginning with a vowel: ");
        console.log(results);
    }); 
    
db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : 1}}}]) */  


/*
 	Object Indexs() 主页面访问
 * @params currentPage当前页面
 * @params pagesize要显示的列表个数
 * */
var Indexs=function(req,res,currentPage,pageSize){
	async.waterfall([
		
		function(callback){
			Banner.find({}).sort({weight:-1}).limit(3).exec(function(err,banner){
				if(err){
					return console.log("banner find err:",err)
				}
				callback(null,banner);
			})
		},
		function(banner,callback){
			Article.count({},function(err,total){	//所有文章
				Article.find({}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function(err,doc){
					callback(null,banner,total,doc);
				})
			});
		},
		function(banner,total,doc,callback){		//最新文章
			Article.findNew(1,function(newart){
				callback(null,banner,total,doc,newart);
			});
		},
		function(banner,total,doc,newart,callback){		//热门文章
			Article.findByHot(3,function(hot){
				callback(null,banner,total,doc,newart,hot);
			})
		}
	],function(err,banner,total,article,newart,hot){
		res.render('www/', {
			title: '个人博客首页',
			banner:banner,
			total:total,
			article:article,	//所有文章
			newart:newart[0],	//最新文章
			hot:hot,				//热门文章
			currentpage:currentPage,	//当前页码
			pagesize:pageSize			//列表数
		});
	});
}
  

















module.exports={
	showIndex:function(req, res) {
		const pageNum=req.params["page"]?req.params["page"]:1;
		Indexs(req,res,pageNum,1);
	},
	showDetial:function(req,res){
		const bid=req.params["bid"];
		async.waterfall([
			function(callback){
				Article.findById(bid,function(doc){
					Article.findByIdUpdate(bid,function(){
						callback(null,doc);
					})
				});
			},
			function(doc,callback){
				Article.findByHot(2,function(hot){
					callback(null,doc,hot);
				})
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
			}
		],function(err,doc,hot,nextArticle,prevArticle){
			res.render("www/detial",{
				article:doc,
				hot:hot,
				title:doc.title,
				nextArticle:nextArticle,
				prevArticle:prevArticle
			});
		})
		
	/*	Article.count({'type':{$in:['0','1','2']}},function(err,doc){
			if(err){
				console.log(err)
			}else{
				
				console.log(doc)
			}
		})*/
		
		/*Article.aggregate([{$group : {_id : "$type",total : {$sum : 1},url : {$push: "$url"}}}], function(err, results){
//	      	callback(null,results);
			results.forEach(function(v,i){
				if(v._id=="0"){
//					arr.id=
					arr.push(v.total);
				}else{
					arr.push(v.total);
				}
			})
		
	       console.log(arr);
	    });*/
	},
	showSearchResults:function(req,res){
		var title=req.query.wd;
		async.waterfall([
			function(callback){
				Article.findByTitle(title,function(doc){
					callback(null,doc);
				});
			}
			
		],function(err,article){
			res.render("www/search_results",{
				article:article,
				title:'搜索结果'
			});
		});
	},
	showLogin:function(req,res){
		res.render("www/login",{
			title:"用户登录"
		})
	},
	showRegist:function(req,res){
		
		res.render("www/regist",{
			title:"用户注册"
		})
	},
	doLogin:function(req,res){
		const username=req.query.username,
		  password=req.query.password;

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
					res.json({
						code:1,
						message:"登录成功！"
					})
				}
			})	
		}
	},
	doRegist:function(req,res){
		const username=req.body.username,
			  password=req.body.password;
		const user=new User({
			username:username,
			password:md5(password)
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
	showWord:function(res,req){
		res.send("111")
	}
	

}