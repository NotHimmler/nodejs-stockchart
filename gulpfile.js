var gulp = require('gulp');
var gulpBrowser = require('gulp-browser');
var del = require('del');
var reactify = require('reactify');
var size = require('gulp-size');

gulp.task('transform', function() {
    var stream = gulp.src('./scripts/jsx/*.js')
        .pipe(gulpBrowser.browserify({ transform: ['reactify'] }))
        .pipe(gulp.dest('./scripts/js/'))
        .pipe(size());

    return stream;
});

gulp.task('del', function() {
    return del(['./scripts/js']);
});

gulp.task('default', ['del'], function() {
    gulp.start('transform');
    gulp.watch('./scripts/jsx/*.js', ['transform']);
});