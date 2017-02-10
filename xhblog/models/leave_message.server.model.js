const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
    
const LMSchema=new Schema({
	message:{
		type:"String"
	},
	post_time:{
		type:Date,
		default:Date.now
	},
	status:{
		type:Number,
		default: 0			//0表示未读  1表示已读
	},
	userid:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});
mongoose.model("Lm",LMSchema);


