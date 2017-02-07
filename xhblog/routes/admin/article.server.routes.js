//文章控制器
var articleCtrl = require('../../controller/admin/article.server.controllers');

var multer = require ('multer');  //上传文件中间件 multer
var md5 = require('md5');
//设置上传的目录，  
//这里指定了一个临时目录（上传后的文件均保存到该目录下），  
//真正开发是一般加入path模块后使用path.join(__dirname,'temp');  
//var upload = multer({ dest:  "public/upload" });  

var storage = multer.diskStorage({
    //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
    //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
    destination: "public/upload/"+new Date().toLocaleDateString(),
    limits: {
	    fileSize: 100000000
	},
    //TODO:文件区分目录存放
    //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//添加配置文件到muler对象。
var upload = multer({
    storage: storage,
    //其他设置请参考multer的limits
    //limits:{}
});


module.exports = function(app) {
	app.get('/admin/article', articleCtrl.showarticle);
	app.get('/admin/article/editor', articleCtrl.showeditor);
	app.post('/admin/article/sub_art', articleCtrl.submit_article);
	app.get('/admin/article/list', articleCtrl.list);
	app.post('/admin/article/page', articleCtrl.page);
	app.get('/admin/article/showsearch', articleCtrl.showsearch);
	app.post('/admin/article/search', articleCtrl.doSearch);
	app.post('/admin/article/remove', articleCtrl.remove);
	app.post('/admin/article/sub',upload.single('resource'),articleCtrl.sub);
	app.post('/admin/article/find', articleCtrl.find);
}
