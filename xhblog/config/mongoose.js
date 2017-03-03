const mongoose=require('mongoose');
const config=require('./db_url.js');

module.exports=function(){
    mongoose.connect(config.mongodb);
    const db = mongoose.connection;
    db.on('error',console.error.bind(console,'连接错误：请检查是否开启了数据库'));
	db.once('open',function(callback){
	  console.log('MongoDB连接成功！！');
	});
	require('../models/category.server.model.js');
    require('../models/articles.server.model.js');
    require('../models/manager.server.model.js');
    require('../models/banners.server.model.js');
    require('../models/leave_message.server.model.js');
    require('../models/friends.service.model.js');
    require('../models/users.server.model.js');
    return db;
}