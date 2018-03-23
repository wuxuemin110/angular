var gulp = require('gulp'),

    historyApiFallback = require('connect-history-api-fallback'),
    browserSync = require('browser-sync').create();
var ngAnnotate = require('gulp-ng-annotate'); 
var ngmin = require('gulp-ngmin'); 
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');  
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
 
gulp.task('default',['serve']);

//执行压缩混淆前，先执行jshint
gulp.task('taskJs',['jshint'], function() {
gulp.start('minifyjs');
});




gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "app",
      middleware: [ historyApiFallback() ]
    }
  });
});


gulp.task('minifyjs', function() {  
    return gulp.src(['./app/templates/**/*.js','!./app/templates/upload/**/*.js','!./app/templates/register-Single/**/*.js','!./app/templates/wx_activity/**/*.js']) //注意，此处特意如此，避免顺序导致的问题
    .pipe(concat('main.js'))    //合并所有js到main.js
    .pipe(gulp.dest('./app/js'))       //输出到文件夹
    .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
    .pipe(ngAnnotate())
    .pipe(ngmin({dynamic: false}))//Pre-minify AngularJS apps with ngmin
    .pipe(stripDebug())//除去js代码中的console和debugger输出
    .pipe(uglify({outSourceMap: false}))    //压缩
    .pipe(gulp.dest('./app/js'));  //输出  
}); 

gulp.task('jshint', function () {
  return gulp.src(['./app/templates/**/*.js','!./app/templates/upload/**/*.js','!./app/templates/register-Single/**/*.js','!./app/templates/wx_activity/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch',function(){
	var jsSrc = './app/templates/**/*.js';
	gulp.watch(jsSrc,function(){
		gulp.run('taskJs');
	});	
	
	
});