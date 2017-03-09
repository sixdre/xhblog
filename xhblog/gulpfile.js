var gulp=require('gulp'),
plugins = require('gulp-load-plugins')(),
nodemon = require('gulp-nodemon');



//实时监听入口文件
gulp.task('nodemon',function() {
  nodemon({ script: 'bin/www',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  });
});


gulp.task('default',['nodemon']);