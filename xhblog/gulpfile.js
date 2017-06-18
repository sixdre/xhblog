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
		clean = require('gulp-clean'),
//		amdOptimize = require("amd-optimize"),
		reqOptimize     = require('gulp-requirejs-optimize'),
		concat	=	 require("gulp-concat"),
		filter = require('gulp-filter'),
		reload = browserSync.reload,
		domSrc = require('gulp-dom-src'),
		cheerio = require('gulp-cheerio'),
		rev = require('gulp-rev'),
		revCollector = require('gulp-rev-collector'),
		htmlreplace = require('gulp-html-replace');


/*
 * 测试打包开始
 */

const projectConfig={
	"client": {
	    "css": {
	        "src": ["public/stylesheets/*.css", "public/stylesheets/**/*.css"],
	        "dist": "dist/public/stylesheets/"
	    },
	    "image": {
            "src": "public/images/**",
            "dist": "dist/public/images/"
        },
        "js": {
            "src": ["public/javascripts/*.js","public/javascripts/**/*.js"],
            "dist": "dist/public/javascripts/"
        }
	},
	"server": {
		"js": {
	        "src": "+(middleware|models|route|controllers|utility|config)/**/*.js",
	        "dist": "dist/"
	    },
	    "views": {
	        "src": [
	            "public/www/*.html",
	            "public/www/**/*.html",
	        ],
	        "dist": "dist/public/www"
	    }
	}
}

const { client, server } = projectConfig;

/**
 * 将 options.src 的内容复制到 options.dist，没有内容则不生成目录。
 *
 * @param {Object} options 配置对象。
 * @param {string|array.<string>} options.src 源内容
 * @param {string} options.dist 输出目录
 */
const copy = ({src, dist}) =>
    gulp.src(src)
        .pipe(gulp.dest(dist));



/**
 * 复制 imgs 目录到生成目录。
 */
gulp.task('release-image',() => {
    copy(client.image);
});

/*
 * 
 *css 压缩复制
 */

gulp.task('release-css', () =>{
    gulp.src(client.css.src)
        .pipe(minifyCss())
        .pipe(gulp.dest(client.css.dist))
});


/**
 * 处理并生成前端 js。
 */
gulp.task('release-js',()=>{
	gulp.src(client.js.src)
    .pipe(uglify())
    .pipe(gulp.dest(client.js.dist))
});
/**
 * 处理并生成server js。
 */
gulp.task('release-server-js',() =>{
	gulp.src(server.js.src)
     	.pipe(gulp.dest(server.js.dist))
});
/**
 * 生成 views
 */
gulp.task('release-views',() => {
	gulp.src(server.views.src)
                .pipe(gulp.dest(server.views.dist))
});


/**
 * 生成 app.js
 */
gulp.task('release-app', () => {
	gulp.src('app.js')
            .pipe(gulp.dest('dist/'))
});

/**
 * 其它文件
 */
gulp.task('release-other',() => {
	copy({
        src: ['package.json','bower.json'],
        dist: 'dist/'
    });
     copy({
        src: ['public/admin/**/*.*'],
        dist: 'dist//public/admin'
    });
    copy({
        src: ['config/settings.json'],
        dist: 'dist/config'
    });
    copy({
        src: 'bin/*',
        dist: 'dist/bin/'
    });
    
    gulp.src('public/admin.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist/public'));
    
});





//gulp.task('adminJs', function() {
//  return gulp.src(['public/admin/js/*.js','public/admin/js/**/*.js'])
//      .pipe(concat('admin.min.js'))
//      .pipe(uglify())
//      .pipe(gulp.dest(client.js.dist));
//});
//
//gulp.task('adminCss', function() {
//  return gulp.src(['public/admin/css/*.css','public/admin/css/**/*.css'])
//      .pipe(concat('admin.min.css'))
//      .pipe(minifyCss())
//      .pipe(gulp.dest(client.css.dist));
//});
//
//gulp.task('adminHtml', function() {
//  return gulp.src('views/admin.html')
//      .pipe(cheerio(function ($) {
//          $('script').remove();
//          $('link').remove();
//          $('body').append('<script src="/javascripts/admin.min.js"></script>');
//          $('head').append('<link rel="stylesheet" href="/stylesheets/admin.min.css">');
//      }))
//      .pipe(gulp.dest('dist/views'));
//});
//
//
//gulp.task('admin',() => {
//	gulp.start(['adminJs','adminCss','adminHtml'],()=>{
//		console.log('admin success');
//	})
//})



gulp.task('release',['release-image','release-css','release-js',
				'release-server-js','release-views','release-app','release-other'],()=>{
	console.log('release success');
})








/*
 * 测试打包结束
 */

//清理生成目录
gulp.task('clean',() => {
	return gulp.src('dist')
		.pipe(clean())
})








//实时监听入口文件
gulp.task('nodemon',() => {
  nodemon({ script: 'bin/www',
    ignore: ['README.md', 'node_modules/**', '.DS_Store']
  });
});





gulp.task('server', ["nodemon"], () => {
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