"use strict";
const IndexCtrl = require('../controller/index');
const CommonCtrl=require('../controller/common.js');		//公用
const AuthCtrl=require('../controller/auth.js');		//用户登陆注册
const CommentCtrl=require('../controller/comment.js');	//评论controller
const WordCtrl=require('../controller/word.js');	//留言controller

const express=require('express');
const commentRouter=express.Router();			//评论路由
const wordRouter=express.Router();				//留言路由
	

module.exports = function(app) {
	app.get('/',CommonCtrl.loadCommonData,IndexCtrl.showIndex);
	app.get('/page/:page',CommonCtrl.loadCommonData,IndexCtrl.showIndex);				//分页
	app.get('/detial/:bid',CommonCtrl.loadCommonData,IndexCtrl.showDetial);				//文章详情页
	app.get('/search',CommonCtrl.loadCommonData,IndexCtrl.showSearchResults);			//搜索文章
	app.get('/login', AuthCtrl.getLogin);
	app.post('/doLogin', AuthCtrl.postLogin);						//登录
	app.get('/regist',AuthCtrl.getRegist);
	app.post('/doRegist', AuthCtrl.postRegist);					//注册
	app.get('/logout',AuthCtrl.logout);						//退出
	
	app.get('/category/:val',CommonCtrl.loadCommonData,IndexCtrl.category);						//提交留言

	app.get('/about',IndexCtrl.about);		//关于我
	/*
	 * 评论路由
	 */
	commentRouter.get("/comment");
	commentRouter.post("/comment",AuthCtrl.checkLoginByAjax,CommentCtrl.postComment);
	
	/*
	 * 留言路由
	 */
	wordRouter.get('/word',AuthCtrl.checkLoginByNative,CommonCtrl.loadCommonData,WordCtrl.getWord);
	wordRouter.post('/word',AuthCtrl.checkLoginByAjax,WordCtrl.postWord);
	
	
	
	
	app.use('/',commentRouter);
	app.use('/',wordRouter);

	
}