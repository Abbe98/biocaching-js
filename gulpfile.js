var gulpDocumentation = require('gulp-documentation');
var gulp = require('gulp');

// Generating a pretty HTML documentation site
gulp.task('docs', function () {
  return gulp.src('./src/biocaching.js')
    .pipe(gulpDocumentation('html'), {}, {
      name: 'Biocaching.js'
    })
    .pipe(gulp.dest('docs'));
});