'use strict';
const gulp=require('gulp'),
		less=require('gulp-less'),
		plugins = require('gulp-load-plugins')(),
		nodemon = require('gulp-nodemon'),
		browserSync = require('browser-sync'),
		minifyCss = require('gulp-minify-css'),
		uglify = require('gulp-uglify'),
		useref = require('gulp-useref'),
		htmlmin = require('gulp-htmlmin'),
		gulpif = require('gulp-if'),
		reload = browserSync.reload;


const appConfig={
    appPath:'public/', //配置源文件路径
    dist:'public/dist/',//配置打包输出路径
    isDebug:true//配置编译方式
};

const paths={
	js:[
		appConfig.appPath+'javascripts/*.js',
		appConfig.appPath+'javascripts/**/*.js'
	],
	css:[
		appConfig.appPath+'stylesheets/*.css'
	],
	html:[
		'views/www/layout/head.html'
	]
}


//实时监听入口文件
gulp.task('nodemon',function() {
  nodemon({ script: 'bin/www',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  });
});

//定义一个testLess任务（自定义任务名称）
/*gulp.task('less', function () {
    gulp.src('public/stylesheets/less/*.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('public/stylesheets/')); //将会在public/stylesheets下生成
});*/

//压缩css
//gulp.task('Cssmain',function(){	
//  return gulp.src(paths.css)         
//   	.pipe(minifyCss())
//      .pipe(gulp.dest(appConfig.dist+'styles'))
//});
//
////压缩js
//gulp.task('Jsmain',function(){	
//  return gulp.src(paths.js)         
//   	.pipe(uglify())
//      .pipe(gulp.dest(appConfig.dist+'scripts'))
//});
////提取html页面的js,css文件进行处理
//gulp.task('html', function () {
//  return gulp.src(paths.html)
//      .pipe(useref())
//      .pipe(gulpif('*.js', uglify()))
//      .pipe(gulpif('*.css', minifyCss()))
//      .pipe(gulp.dest(appConfig.dist));
//});
//
//
//gulp.task('build',['Jsmain','Cssmain','html'],function(){
//	console.log('build success');
//})


gulp.task('server', ["nodemon"], function() {
    var files = [
        'views/**/*.html',
        'views/**/*.ejs',
        'views/**/*.jade',
        'public/**/*.*',
        '!public/upload/**/*.*'
    ];

    //gulp.run(["nodemon"]);
    browserSync.init(files, {
        proxy: 'http://localhost:7893',		//代理地址，和bin/www里的端口号要一致
        browser: 'chrome',
        notify: false,
        port: 7892
    });

    gulp.watch(files).on("change", reload); 
});

gulp.task('default',['server']);