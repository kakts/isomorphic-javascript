const gulp = require('gulp');
const babel = require('gulp-babel');

const nodemon = require('gulp-nodemon');
const sequence = require('run-sequence');


gulp.task('start', function() {
  nodemon({
    watch: 'dist',
    script: 'dist/index.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  });
});
gulp.task('default', function(callback) {
  sequence(['compile', 'watch'], 'start', callback);
});

gulp.task('compile', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['compile']);
});
