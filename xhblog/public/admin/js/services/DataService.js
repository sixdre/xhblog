"use strict";
//公共数据服务(用于页面初始化向后台请求的公共数据)
angular.module('app').service('DataService',function(){
	this.ArticleTotal=0;		//文章总数
	this.Words=[];				//留言
	this.Categorys=[];		//文章分类
	this.Tags=[];				//文章标签
	this.Manager={};			//管理员用户
})