"use strict";
//后台管理主页面控制器
const adminCtrl = require('../../controller/admin/admin.server.controller');
//后台文章管理控制器
const articleCtrl = require('../../controller/admin/article.server.controller');
//后台网站设置控制器
const settingCtrl = require('../../controller/admin/setting.server.controller');
const express=require('express');
const admin=express.Router();			//后台
const article=express.Router();			//文章
const setting=express.Router();			//设置

module.exports = function(app) {
	/*app.get('/admin', adminCtrl.showadmin);
	app.post('/admin/logout', adminCtrl.logout);
	app.post('/admin/doRegist', adminCtrl.doRegist);
	app.post('/admin/doLogin', adminCtrl.doLogin);
	app.get('/admin/loadData', adminCtrl.loadData);*/
	
	admin.get('/', adminCtrl.showadmin);
	admin.post('/logout', adminCtrl.logout);
	admin.post('/doRegist', adminCtrl.doRegist);
	admin.post('/doLogin', adminCtrl.doLogin);
	admin.get('/loadData', adminCtrl.loadData);
	
	/*
	 * 文章
	 */
	article.get('/list', articleCtrl.list);
	article.post('/page', articleCtrl.page);
	article.post('/search', articleCtrl.doSearch);
	article.post('/remove', articleCtrl.remove);
	article.post('/sub',articleCtrl.sub);
	article.post('/find', articleCtrl.find);
	article.post('/update', articleCtrl.update);
	article.post('/del', articleCtrl.del);
	article.post('/testUpload',articleCtrl.testUpload);
	article.post('/publish',articleCtrl.publish);			//新的发布路由
	article.get('/category',articleCtrl.categoryList);			//文章分类
	article.post('/category',articleCtrl.categoryAdd);			//文章添加
	article.post('/category/remove',articleCtrl.categoryRemove);			//文章添加
	
	/*
	 * 设置
	 */
	setting.post('/post_banner',settingCtrl.post_banner);			//首页轮播图
	setting.post('/addFriend',settingCtrl.addFriend);	//友情链接
	setting.get('/loadFriend',settingCtrl.loadFriend);	//友情链接
	setting.post('/delFriend',settingCtrl.delFriend);	//友情链接
	setting.post('/updateFriend',settingCtrl.updateFriend);	//友情链接
	
	
	app.use('/admin',admin);
	app.use('/admin/article',article);
	app.use('/admin/setting',setting);
}


	
