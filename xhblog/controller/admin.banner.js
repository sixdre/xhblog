"use strict";
//引入数据模型  
const mongoose=require('mongoose');
const Banner=mongoose.model("Banner");					//文章标签						
const async = require('async');


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
 * getBanners 获取Banners
 */
exports.getBanners=function(req,res,next){

}

/*
 *postFriend  提交Friend保存Friend
 *
 */
exports.postBanner=function(req,res,next){
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
}

















