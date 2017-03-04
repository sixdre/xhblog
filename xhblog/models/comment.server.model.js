const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.Types.ObjectId;  
const CommentSchema = new Schema({
	  article:{type: ObjectId, ref: 'Article'},
	  from:{type: ObjectId, ref: 'User'},		//谁评论
	  reply:[{			
		    from: {type: ObjectId, ref: 'User'},
		    to: {type: ObjectId, ref: 'User'},
		    content: String
	  }],
	  content: String,
	  create_time:{
		  type: Date,
      	  default: Date.now()
	  },
	  update_time: {
	      type: Date,
	      default: Date.now()
	  }  
});
CommentSchema.pre('save', function(next) {
	  if (this.isNew) {
	    this.create_time = this.update_time = Date.now();
	  } else {
	    this.update_time = Date.now();
	  }
	  next()
});

CommentSchema.statics = {
  findAll: function(cb) {
    return this
      .find({})
      .sort('update_time')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this 
      .findOne({_id: id})
      .exec(cb)
  }
}

mongoose.model('Comment',CommentSchema);  






