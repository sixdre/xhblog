'use strict';
const mongoose = require('mongoose')  
    , Schema = mongoose.Schema  
    , ObjectId = Schema.ObjectId;  
    
const autoIncrement = require('mongoose-auto-increment');   //自增ID 模块		http://www.pinterspace.com/2015/mongoose-定义自增字段.html
autoIncrement.initialize(mongoose.connection);
//文章
const ArticleSchema=new Schema({ 
 	author:{
        type:'String',
        required:true 		//作者非空
    },
    title:String,
    type:{
    	type:String,
    	//enum:['','']  //只能是
    },
    category:{
	    type: ObjectId,
	    ref: 'Category'
	},
	tags:[],
    content:String,
    tagcontent:String,
    imgurl:String,
    create_time: { type: Date, default: Date.now },        //创建时间
    update_time: { type: Date, default: Date.now },
    likes:{type: Number, default: 0 },		//点赞数
    pv:{type: Number, default: 0 },		//浏览量
    comments:{type: Number, default: 0 },	//评论数
    top: { type: Boolean, default: false }, // 置顶文章
    good: { type: Boolean, default: false } // 精华文章

})
/*const categorySchema = mongoose.Schema({
  name: String
}*/
//Schema.method( 'say', function(){console.log('hello');} ) 	//这样Model和Entity的实例就能使用这个方法了
 

 
//查找所有
ArticleSchema.statics.findAll = function(callback) {
    return this.model('Article')
        .find({})
        .sort({ time: -1 })
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
//查找最新的
ArticleSchema.statics.findNew = function(limit,callback) {
    return this.model('Article')
        .find({})
        .sort({ time: -1 })
        .limit(limit)
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}


//通过id来查找
ArticleSchema.statics.findById = function(id,callback) {
	return this.model('Article').findOne({bId:id}, function (error, doc) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
        	callback(doc);
        }
    });
  
}

//限制数量
ArticleSchema.statics.findByLimit = function(num,callback) {
	return this.model('Article')
        .find({})
        .sort({ time: -1 }).skip(0).limit(num)
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
//根据时间来查找
ArticleSchema.statics.findByTime = function(time,callback) {
	return this.model('Article')
        .find({time:{"$gt":time}})
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}

//根据文章浏览数来排序
ArticleSchema.statics.findByHot = function(limit,callback) {
	return this.model('Article')
        .find({})
        .sort({views:-1})
        .limit(limit)
        .exec(function (error, hot) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(hot);
            }
        });
}

//根据文章标题进行查找
ArticleSchema.statics.findByTitle = function(title,callback) {
	return this.model('Article')
        .find({title:{$regex:''+title+''}})
        .sort({time:-1})
        .exec(function (error, doc) {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(doc);
            }
        });
}
//根据文章文章id进行更新
ArticleSchema.statics.findByIdUpdate = function(id,callback) {
	return this.model('Article')
        .update({bId:id},{'$inc':{pv: 1}})
        .exec(function (error) {
            if (error) {
                console.log(error);
            } else {
                callback();
            }
        });
}


/* var CounterSchema = Schema({
 	_id: {
 		type: String,
 		required: true
 	},
 	seq: {
 		type: Number,
 		default: 0
 	}
 });
 var counter = mongoose.model('counter', CounterSchema);*/
/*ArticleSchema.pre('save', function(next) {
	var doc = this;
	counter.findByIdAndUpdate({
		_id: 'entityId'
	}, {
		$inc: {
			seq: 1
		}
	}, function(error, counter) {
		if(error)
			return next(error);
		doc.testvalue = counter.seq;
		next();
	});
});*/

ArticleSchema.plugin(autoIncrement.plugin, {
    model: 'Article',   //数据模块，需要跟同名 x.model("Books", BooksSchema);
    field: 'bId',     //字段名
    startAt: 1,    //开始位置，自定义
    incrementBy:1    //每次自增数量
});
ArticleSchema.pre('save', function(next) {
	if(this.isNew) {
		this.create_time = this.update_time = Date.now()
	} else {
		this.update_time = Date.now()
	}

	next()
});
 
mongoose.model('Article', ArticleSchema);  