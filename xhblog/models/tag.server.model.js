'use strict';
const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.Types.ObjectId;  

const TagSchema = new Schema({
	  name: {
	    unique: true,
	    type: String
	  },
	  create_time:{type: Date, default: Date.now},
	  update_time:{type: Date, default: Date.now }
});

TagSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create_time = this.update_time = Date.now();
  } else {
    this.update_time = Date.now();
  }
  next()
});
TagSchema.statics = {
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
  },
  findByName:function(name,cb){
	  return this 
      .findOne({name: name})
      .exec(cb)
  }
}
mongoose.model('Tag',TagSchema);  