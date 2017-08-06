var gulp = require('gulp');
var sass = require("gulp-sass");
var gutil = require('gulp-util');
var uglify = require('')

gulp.task ('copy', function(){
    gulp.src('app.js').pipe(gulp.dest('assets'));
});

gulp.task('sass', function(){
    gulp.src('public/stylesheets/style1.scss').pipe(sass({style: "expanded"})).on('error', gutil.log).pipe(gulp.dest('assets'));
});
