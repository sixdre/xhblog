"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Article = mongoose.model('Article');				//文章
const Banner = mongoose.model('Banner');					//banner图
const Friend = mongoose.model('Friend');					//友情链接

//检查是否为链接
function checkURL(URL) {
	var str = URL;
	//下面的代码中应用了转义字符"\"输出一个字符"/"
	var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
	var objExp = new RegExp(Expression);
	if(objExp.test(str) == true) {
		return true;
	} else {
		return false;
	}
}
//检查一个值是否位于数组中
function contain(arr,val){
	var i = arr.length;  
    while (i--) {  
        if (arr[i] === val) {  
            return true;  
        }  
    }  
    return false;  
}
const multer = require ('multer');  //上传文件中间件 multer
const md5 = require('md5');

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


/*
 * 网站banner提交
 * */
exports.post_banner=function(req,res){
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

		if(contain(typeArray,"jpg")&&checkURL(req.body.link)&&req.body.dec.length){
		
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
	
};

/*
 * 查询友链
 * */
exports.loadFriend=function(req,res){
	Friend.find({}).sort({time:-1}).exec(function(err,doc){
		if(err){
			return console.dir(err);
		}
		res.json({
			code:1,
			doc:doc
		});
	})
}

/*
 * 友情链接添加
 * */
exports.addFriend=function(req,res){
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
	
}
/*
 * 友情链接删除
 * */
exports.delFriend=function(req,res){
	Friend.remove({_id:req.body.id}).exec(function(err){
		if(err){
			return console.log(err);
		}
		res.json({
			code:1
		});
	})
}
/*
 * 友情链接更新
 * */
exports.updateFriend=function(req,res){
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
	
}







