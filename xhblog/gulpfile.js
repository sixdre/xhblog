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
//		amdOptimize = require("amd-optimize"),
		reqOptimize     = require('gulp-requirejs-optimize'),
		concat	=	 require("gulp-concat"),
		filter = require('gulp-filter'),
		reload = browserSync.reload;


const appConfig={
    appPath:'public/', //配置源文件路径
    dist:'dist/',//配置打包输出路径
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

//gulp.task('default',function(){
//  var jsFilter = filter('**/*.js',{restore:true});
//  var cssFilter = filter('**/*.css',{restore:true});
//  var indexHtmlFilter = filter(['**/*','!**/index.html'],{restore:true});
//
//  return gulp.src('src/index.html')
//      .pipe(useref())//合并js ，css
//      .pipe(jsFilter)
//      .pipe(uglify())//压缩js
//      .pipe(jsFilter.restore)
//      .pipe(cssFilter)
//      .pipe(csso())//压缩css
//      .pipe(cssFilter.restore)
//      .pipe(indexHtmlFilter)
//      .pipe(rev())//添加哈希
//      .pipe(indexHtmlFilter.restore)
//      .pipe(revReplace())//替换哈希码
//      .pipe(gulp.dest('dist'));输出
//});






//gulp.task("adddd", function () {  
//   gulp.src("public/javascripts/home.js")
//      .pipe(reqOptimize({
//          optimize:"none",                                //- none为不压缩资源
//          //findNestedDependencies: true, //- 解析嵌套中的require
//          paths:{
//              "PDAppDir":"",                              //- 所有文件的路径都相对于main-build.js，所以这里为空即可
//              "jquery":"empty:"
//          }
//      }))
//      .pipe(rename("main.min.js"))
//      .pipe(gulp.dest('dist'));                            //-
// 
//});  



//实时监听入口文件
gulp.task('nodemon',function() {
  nodemon({ script: 'bin/www',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  });
});

//
//// 压缩 ejs
//gulp.task('ejs', function() {
//	return gulp.src('views/**/*.ejs')
//		.pipe(htmlmin({ collapseWhitespace: true }))
//		.pipe(gulp.dest('dist/views/'));
//});
//
//
//// 压缩 js
//gulp.task('js', function() {
//	return gulp.src('public/javascripts/**/*.js')
//		.pipe(jshint())
//		.pipe(jshint.reporter('default'))
//		.pipe(uglify({ compress: true }))
//		.pipe(gulp.dest('dist/javascripts/'))
//});


//定义一个testLess任务（自定义任务名称）
/*gulp.task('less', function () {
    gulp.src('public/stylesheets/less/*.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('public/stylesheets/')); //将会在public/stylesheets下生成
});*/

//压缩css
gulp.task('Cssmain',function(){	
    return gulp.src(paths.css)         
     	.pipe(minifyCss())
     	.pipe(concat("index.min.css"))
        .pipe(gulp.dest(appConfig.dist+'styles'))
});

//压缩js
gulp.task('Jsmain',function(){	
    return gulp.src(paths.js)         
     	.pipe(uglify())
        .pipe(gulp.dest(appConfig.dist+'scripts'))
});
//提取html页面的js,css文件进行处理
gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(appConfig.dist));
});








gulp.task('build',['Jsmain','Cssmain','html'],function(){
	console.log('build success');
})


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