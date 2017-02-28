var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var less = require('gulp-less');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('default', function(){
    gulp.start('buildStyles');
    gulp.start('buildJS');
});

gulp.task('buildStyles', function(){
    gulp.src('./src/less/header_module.less')
        .pipe(less().on('error', gutil.log))
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./dest/css/'));
});
gulp.task('buildJS', function() {
    gulp.src(["./src/js/swiper.jquery.js","./src/js/*.js"])
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('./dest/js/'));
});

gulp.task('watch', function(){
    gulp.watch('./src/less/*.less', ['buildStyles']);
    gulp.watch('./src/js/*.js', ['buildJS']);
});
