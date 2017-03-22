"use strict";
//后台管理主页面控制器
const adminCtrl = require('../controller/admin.js');
//后台文章管理控制器
const articleCtrl = require('../controller/admin.article.js');
//友链控制器
const friendCtrl = require('../controller/admin.friend.js');
//banner控制器
const bannerCtrl=require('../controller/admin.banner.js');

//tag控制器
const tagCtrl=require('../controller/admin.tag.js');
//category控制器
const categoryCtrl=require('../controller/admin.category.js');

const express=require('express');
const adminRouter=express.Router();			
const articleRouter=express.Router();		
const friendRouter=express.Router();	
const bannerRouter=express.Router();
const tagRouter=express.Router();			
const categoryRouter=express.Router();			


module.exports = function(app) {
	/*
	 * admin
	 */
	adminRouter.get('/', adminCtrl.showadmin);
	adminRouter.post('/logout', adminCtrl.logout);
	adminRouter.post('/doRegist', adminCtrl.doRegist);
	adminRouter.post('/doLogin', adminCtrl.doLogin);
	adminRouter.get('/loadData', adminCtrl.loadData);
	
	/*
	 * article
	 */
	articleRouter.get('/article/list', articleCtrl.list);
	articleRouter.post('/article/page', articleCtrl.page);
	articleRouter.post('/article/search', articleCtrl.search);
	articleRouter.post('/article/remove', articleCtrl.remove);
	articleRouter.post('/article/find', articleCtrl.find);
	articleRouter.post('/article/update', articleCtrl.update);
	articleRouter.post('/article/del', articleCtrl.del);
	articleRouter.post('/article/publish',articleCtrl.publish);			//新的发布路由
	
	/*
	 * friend 友链
	 */
	friendRouter.get('/friend',friendCtrl.getFriends);
	friendRouter.post('/friend',friendCtrl.postFriend);
	friendRouter.post('/friend/remove',friendCtrl.removeFriend);
	friendRouter.post('/friend/update',friendCtrl.updateFriend);
	
	/*
	 * banner 
	 */
	bannerRouter.post('/banner',bannerCtrl.postBanner);
	
	/*
	 * category
	 */
	categoryRouter.get("/category",categoryCtrl.getCategory);
	categoryRouter.post("/category",categoryCtrl.postCategory);
	categoryRouter.post('/category/remove',categoryCtrl.removeCategory);			//分类删除
	
	
	/*
	 * tag
	 */
	tagRouter.get('/tag',tagCtrl.getTags);
	tagRouter.post('/tag',tagCtrl.postTag);
	tagRouter.post('/tag/remove',tagCtrl.deleteTag)
	
	
	app.use('/admin',adminRouter);
	app.use('/admin',articleRouter);
	app.use('/admin',friendRouter);
	app.use('/admin',bannerRouter);
	app.use('/admin',categoryRouter);
	app.use('/admin',tagRouter);
	
	
	
	
}

