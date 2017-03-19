"use strict";
const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;  

//用户
const UserSchema=new Schema({ 
 	username:{
        type:'String',
        required:true 		
    },
    password:String,
    email:String,
    create_time: { type: Date, default: Date.now },        //创建时间
    isAdmin:{ type: Boolean, default: false },
})

 
 
//查找所有
UserSchema.statics.findAll = function(callback) {
    return this.model('User')
        .find({})
        .sort({ time: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}


//通过id来查找
UserSchema.statics.findById = function(id,callback) {
	return this.model('User').findOne({_id:id}, function (error, doc) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
        	callback(doc);
        }
    });
  
}

//根据用户名进行查找
UserSchema.statics.findByName = function(title,callback) {
	return this.model('User')
        .find({title:{$regex:''+title+''}})
        .sort({time:-1})
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}



mongoose.model('User', UserSchema);  