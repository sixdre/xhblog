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
	}
})
mongoose.model("Lm",LMSchema);


