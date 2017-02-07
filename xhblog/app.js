var express = require('express');
var session=require('express-session');
var cookieParser = require('cookie-parser');
var formidable = require('formidable');
var fs = require('fs'); 							//node.js核心的文件处理模块
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var ueditor = require("ueditor");			//编辑器
global.moment = require('moment'); 			//时间格式化
//var common = require('./common');			//公用




//数据库连接
var mongoose=require('./config/mongoose.js');
var db=mongoose();

var app = global.app= express();




//设置session
app.use(session({
  secret: '12345',
  name: 'name',
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //超时时间
  saveUninitialized: true,
  resave: false
//store:new MongoStore({url: 'mongodb://localhost/runoob'})
}));

//设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





//百度编辑器
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function (req, res, next) {
    //客户端上传文件设置
     var ActionType = req.query.action;
     console.log(ActionType)
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = '/img/ueditor/';//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
  
    }
    // 客户端发起其它请求
    else {
           console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

//根据浏览器地址来给后台左侧菜单添加选中状态

app.use(function(req,res,next){
	res.locals.activeNav = function (nav){
    var result = '';
    if(nav==req.path){
    	result = 'active';
    }
    /*  if(nav == '/admin'){
        if(req.path == '/admin'){
          result = 'active';
        }
      }else{
      	console.log(req.path)
        if(req.path.indexOf(nav) == 0){
          result = 'active';
        }
      }*/
    return result;
  };
  next();
})


//页面路由控制
var routes = require('./routes/server.routes.js');				
routes(app);			


//app.use(common.sundry);				//根据浏览器地址来给后台左侧菜单添加选中状态
//console.log(common.sundry())





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

