"use strict";
const mongoose=require('mongoose');
const ArticleModel = mongoose.model('Article');			//文章

exports.getArticles=function(params){
	let currentPage=parseInt(params.currentPage)-1;
	currentPage<=0?0:currentPage
	let limit=parseInt(params.limit);
	let title=params.title||'';
	let flag=parseInt(params.flag)||0;
	let queryObj={
		title:{'$regex':title},
	}
	switch(flag){
		case 1:		//有效
		queryObj.isActive=true;
		queryObj.isDraft=false;
		break;
		case 2:		//无效
		queryObj.isActive=false;
		break;
		case 3:		//草稿
		queryObj.isDraft=true;
		break;
	}
	return ArticleModel.find(queryObj)
		.sort({"create_time": -1})
		skip(limit*currentPage)
		.limit(limit)
		.populate('category','name')
		.exec();
}
