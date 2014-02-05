var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var styl = require('gulp-styl');
var refresh = require('gulp-livereload');
var lr = require('tiny-lr');
var server = lr();

gulp.task('scripts', function() {
  gulp.src(['app/js/**/*.js'])
    .pipe(browserify())
    .pipe(concat('dest.js'))
    .pipe(gulp.dest('build'))
    .pipe(refresh(server))
})

gulp.task('styles', function() {
  gulp.src(['app/css/**/*.css'])
    .pipe(styl({
      compress: true
    }))
    .pipe(gulp.dest('build'))
    .pipe(refresh(server))
})

gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if (err) return console.log(err);

    gulp.watch(['js/**/*.js', '*.html', 'css/**/*.css'], function(event) {
      gulp.src('index.html').pipe(refresh(server))
    })
  });
})

gulp.task('build', ['lr-server', 'scripts', 'styles'], function() {
})

gulp.task('default', ['lr-server'], function() {
})