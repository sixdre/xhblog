const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;
    
const FriendSchema=new Schema({
	title:{
		type:"String",
		required:true 
	},
	url:{
		type:"String",
		required:true 
	},
	post_time:{
		type:Date,
		default:Date.now
	}
})
mongoose.model("Friend",FriendSchema);


