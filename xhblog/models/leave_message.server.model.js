'use strict';
const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
    
const LMSchema=new Schema({
	user:{
		type: ObjectId,
		ref: 'User'
	},
	message:{
		type:"String"
	},
	isRead:{
		type:Number,
		default: 0			//0表示未读  1表示已读
	},
	post_time:{
		type:Date,
		default:Date.now
	},

});
mongoose.model("Lm",LMSchema);


