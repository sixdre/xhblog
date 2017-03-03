const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.Types.ObjectId;  

const CategorySchema = new Schema({
	  name: {
	    unique: true,
	    type: String
	  },
	  articles: [{type: ObjectId, ref: 'Article'}], 
	  create_time:{type: Date, default: Date.now},
	  update_time:{type: Date, default: Date.now },
});

CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.create_time = this.update_time = Date.now();
  } else {
    this.update_time = Date.now();
  }
  next()
});
CategorySchema.statics = {
  findAll:function(cb) {
    return this
      .find({})
      .sort('create_time')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this 
      .findOne({_id: id})
      .exec(cb)
  }
}
mongoose.model('Category',CategorySchema);  







