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
//查找所有
FriendSchema.statics.findAll = function(callback) {
    return this.model('Friend')
        .find({})
        .sort({ post_time: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}



mongoose.model("Friend",FriendSchema);


