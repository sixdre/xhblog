'use strict';
const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;  
    
//管理员
const ManagerSchema = new Schema({  
      name: String 
    , email:String
    , password: String
    , time:{type: Date, default: Date.now },
    power:{type: Number, default:1 }
});  

ManagerSchema.statics.findAll = function(callback) {
    return this.model('Manager').find({}, function (error, doc) {
            if (error) {
                console.log(error);
                callback(null);
            } else {
                if(doc.length == 0)
                    callback(null);
                else callback(doc);
            }
    });
}
//根据id进行查找
ManagerSchema.statics.findById = function(id,callback) {
    return this.model('Manager').findOne({_id:id}, function (error, doc) {
            if (error) {
                console.log(error);
                callback(null);
            } else {
                //console.log(doc);
                if(doc.length == 0)
                    callback(null);
                else callback(doc[0]);
            }
    });
}


mongoose.model('Manager', ManagerSchema); 