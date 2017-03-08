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
	reply:{
		type:"String"
	},
	meta:{
		isRead:{
			type:Boolean,
			default:false			//false表示未读  true表示已读
		},
		isReply:{
			type:Boolean,
			default:false			//false表示未回复  true表示已回复
		},
	},
	post_time:{
		type:Date,
		default:Date.now
	},

});
mongoose.model("Lm",LMSchema);


