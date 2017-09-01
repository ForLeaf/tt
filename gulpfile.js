var gulp = require('gulp');


//任务：利用gulp-sass编译sass
//如何使用gulp创建一个任务
var sass = require('gulp-sass');

gulp.task('compileSass',function(){
	setTimeout(function(){
		// 找到sass文件
		return gulp.src('./src/sass/*.scss') //文件流（文件在内存中的状态，水流）

			// 编译
			.pipe(sass({outputStyle:'compact'}).on('error', sass.logError))

			// 输出文件
			.pipe(gulp.dest('./src/css'))

	},500);
});

// 自动刷新
var browserSync = require('browser-sync');
gulp.task('server', function () {
	browserSync({
		// 静态服务器
		// server:'./src/',

		// 代理服务器
		proxy: 'http://localhost/mmx/',

		// 端口
		port: 2008,

		// 监听文件修改，自动刷新浏览器
		files: ['./src/**/*.html', './src/css/*.css', './src/api/*.php','./src/js/*.js']
	});



	// 开启服务器的同时，监听sass的修改
	gulp.watch('./src/**/*.scss', ['compileSass']);
});

