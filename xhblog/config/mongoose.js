"use strict";
const mongoose=require('mongoose');
const config=require('./db_url.js');
const fs=require('fs');
const path=require('path');

module.exports=function(){
    mongoose.connect(config.mongodb);
    const db = mongoose.connection;
    db.on('error',console.error.bind(console,'连接错误：请检查是否开启了数据库'));
	db.once('open',function(callback){
	  console.log('MongoDB连接成功！！');
	});
	const models_path=path.join(__dirname,'../')+'models';
	let walk=function(path){
		fs.readdirSync(path).forEach(function(file){
			let newPath=path+'/'+file;
			let stat=fs.statSync(newPath);
			if(stat.isFile()){
				if(/(.*)\.(js)/.test(file)){
					require(newPath);
				}
			}else if(stat.isDirectory()){
				walk(newPath);
			}
		});
	}
	walk(models_path);
	
	/*require('../models/category.server.model.js');
    require('../models/articles.server.model.js');
    require('../models/comment.server.model.js');
    require('../models/manager.server.model.js');
    require('../models/banners.server.model.js');
    require('../models/leave_message.server.model.js');
    require('../models/friends.service.model.js');
    require('../models/users.server.model.js');*/
    return db;
}