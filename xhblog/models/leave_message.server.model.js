'use strict';
const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
    
const LMSchema=new Schema({
	user:{					//留言用户
		type: ObjectId,
		ref: 'User'
	},
	message:{				//留言内容
		type:"String"
	},
	replyUser:{				//回复者
		type: ObjectId,
		ref: 'User'
	},
	replyContent:{			//回复内容
		type:"String"
	},
	state:{
		isRead:{
			type:Boolean,
			default:false			//false表示未读  true表示已读
		},
		isReply:{
			type:Boolean,
			default:false			//false表示未回复  true表示已回复
		}
	},
	meta:{
		postTime:{					//用户留言时间
			type:Date,
			default:Date.now
		},
		replyTime:{					//回复时间
			type:Date
		}
	}

});
mongoose.model("Lm",LMSchema);


