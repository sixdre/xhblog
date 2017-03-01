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
	logo:{
		type:String
	},
	sort:{
		type: Number, 
		default: 0
	},
	post_time:{
		type:Date,
		default:Date.now
	},
	update_time:{ 
		type: Date, 
		default: Date.now 
	}
})

FriendSchema.pre("save",function(next){
	if(this.isNew){
		this.post_time=this.update_time=Date.now();
	}else{
		this.update_time=Date.now();
	}
	next();
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


