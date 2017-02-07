var mongoose=require('mongoose');
var config=require('./db_url.js');

module.exports=function(){
    var db=mongoose.connect(config.mongodb);
    require('../models/articles.server.model.js');
    require('../models/manager.server.model.js');
    require('../models/banners.server.model.js');
    require('../models/leave_message.server.model.js');
     require('../models/friends.service.model.js');
    return db;
}