var gulp=require('gulp'),
less=require('gulp-less'),
plugins = require('gulp-load-plugins')(),
nodemon = require('gulp-nodemon'),
browserSync = require('browser-sync'),
reload = browserSync.reload;

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