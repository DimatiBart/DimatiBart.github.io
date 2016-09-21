var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var less = require('gulp-less');
var gutil = require('gulp-util');

gulp.task('default', function(){
    gulp.start('buildStyles');
});

gulp.task('buildStyles', function(){
    gulp.src('./src/less/flex_calendar.less')
        .pipe(less().on('error', gutil.log))
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./dest/css/'));
});