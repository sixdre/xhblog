"use strict";
const express = require('express');
const session=require('express-session');
const mongoStroe=require('connect-mongo')(session);	//connect-mongo用来在数据库存储session的模块
const cookieParser = require('cookie-parser');
const formidable = require('formidable');
const fs = require('fs'); 							//node.js核心的文件处理模块
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');			//用来处理请求数据
const ueditor = require("ueditor");			//编辑器
global.moment = require('moment'); 			//时间格式化
global.md5=require("md5");					//md5加密
global.validator = require('validator');	//表单验证
//var common = require('./common');			//公用




//数据库连接
const mongoose=require('./config/mongoose.js');
const db=mongoose();

const app = global.app= express();

app.locals.moment=moment;
app.use(cookieParser("xhtest"));
//设置session
app.use(session({
  secret: 'xhtest',
  //name: 'name',			//设置 cookie 中，保存 session 的字段名称，默认为 connect.sid 。
  cookie: {maxAge: 1000 * 60 * 60 * 24}, //超时时间
  saveUninitialized: true,
  resave: false,
  store:new mongoStroe({
	  url: 'mongodb://localhost/blog',
	  collection:'sessions'
  })
}));

//设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));		//extended为false时，键值对中的值就为'String'或'Array'形式,为true,则可为任何类型
app.use(express.static(path.join(__dirname, 'public')));
/*app.use(bodyParser({ uploadDir: "./public/upload" }));*/  




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
const routes = require('./routes/server.route.js');				
routes(app);			


//app.use(common.sundry);				//根据浏览器地址来给后台左侧菜单添加选中状态
//console.log(common.sundry())





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
  res.render('www/error');
});

module.exports = app;

