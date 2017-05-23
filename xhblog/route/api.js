"use strict";
//后台管理路由
const express = require('express');
const router = express.Router();
const multer = require('multer'); //上传文件中间件 multer

const ArticleCtrl=require('../controllers/article.controller');
const CategoryCtrl=require('../controllers/category.controller');
const TagCtrl=require('../controllers/tag.controller');
const FriendCtrl=require('../controllers/friend.controller');
const UserCtrl=require('../controllers/user.controller');
const WordCtrl=require('../controllers/word.controller');
const FileCtrl=require('../controllers/file.controller');
//验证中间件
const Auth = require('../middleware/auth');

const storage = multer.diskStorage({
	//设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
	//Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
	destination: "public/upload/cover/" + moment(Date.now()).format('YYYY-MM'),
	//  destination: function (req, file, cb) {
	//      cb(null, 'public/upload/'+file.fieldname+'/'+moment(Date.now()).format('YYYY-MM'))
	//  }, 
	limits: {
		fileSize: 100000000
	},
	//TODO:文件区分目录存放
	//获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
	filename: function(req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
});

//添加配置文件到muler对象。
const upload = multer({
	storage: storage,
	//其他设置请参考multer的limits
	//limits:{}
});

//router.use(function(req,res,next){
//	if(!req.session["manager"]){
//		let err = new Error('错误');
//		err.status = 401;
//		next(err);
//		console.log(123);
////		return res.status(401).json({
//	
//});
//	}
//	next();
//})/


//获取文章
router.get('/article',ArticleCtrl.getArticles);
//根据id获取
router.get('/article/:id',ArticleCtrl.getArticleById);
//文章发布
router.post('/article/publish',Auth.checkAdmin, upload.single('cover'),ArticleCtrl.publish);
//文章更新
router.put('/article/update',Auth.checkAdmin, upload.single('cover'),ArticleCtrl.update);
//文章删除(单项)
router.delete('/article/:id',Auth.checkAdmin,ArticleCtrl.deleteOne);
//文章删除（多选)
router.post('/article/removeMulti', Auth.checkAdmin,ArticleCtrl.deleteMulti);
//查询文章
router.get('/article/search',ArticleCtrl.search);
//文章点赞
router.put('/article/:id/likes',ArticleCtrl.addLikes);
//获取文章评论
router.get('/article/:id/comment',ArticleCtrl.getComments);
//文章评论
router.post('/article/:id/comment',Auth.checkLoginByAjax,ArticleCtrl.addComment);
//评论点赞
router.post('/comment/:id/point',Auth.checkLoginByAjax,ArticleCtrl.addCommentLike);


//获取category数据
router.get("/category",CategoryCtrl.getCategories);
//分类添加
router.post("/category", Auth.checkAdmin,CategoryCtrl.add);
//分类更新
router.put("/category", Auth.checkAdmin,CategoryCtrl.update);
//分类删除
router.delete('/category/:id', Auth.checkAdmin,CategoryCtrl.remove);

//获取标签数据
router.get('/tag',TagCtrl.getTags);
//新增标签
router.post('/tag', Auth.checkAdmin,TagCtrl.add);
//更新标签
router.put('/tag', Auth.checkAdmin, TagCtrl.update);
//删除标签
router.delete('/tag/:id', Auth.checkAdmin,TagCtrl.remove);

//获取友情链接数据 
router.get('/friend',FriendCtrl.getFriends);
//添加友情链接
router.post('/friend',Auth.checkAdmin,FriendCtrl.add);
//更新友链
router.put('/friend', Auth.checkAdmin,FriendCtrl.update);
//删除友情链接
router.delete('/friend/:id', Auth.checkAdmin,FriendCtrl.remove);


//获取注册用户
router.get('/users', Auth.checkAdmin, UserCtrl.getUsers)

//获取留言
router.get('/word',Auth.checkAdmin,WordCtrl.getTags);
//提交留言
router.post('/word',Auth.checkLoginByAjax,WordCtrl.add);
//留言回复
router.post('/word/reply', Auth.checkAdmin,WordCtrl.reply);


//获取所有文件
router.get('/allFiles', Auth.checkAdmin, FileCtrl.getFiles);
//下载文件
router.get('/download', FileCtrl.download);



module.exports = router;