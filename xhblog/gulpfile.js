var gulp=require('gulp'),
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

gulp.task('server', ["nodemon"], function() {
    var files = [
        'views/**/*.html',
        'views/**/*.ejs',
        'views/**/*.jade',
        'public/**/*.*'
    ];

    //gulp.run(["nodemon"]);
    browserSync.init(files, {
        proxy: 'http://localhost:7893',
        browser: 'chrome',
        notify: false,
        port: 7892
    });

    gulp.watch(files).on("change", reload); 
});

gulp.task('default',['server']);