const gulp = require('gulp')
const concat = require('gulp-concat')

gulp.task('d.ts', function () {
  return gulp.src('js/**/*.d.ts')
    .pipe(concat('index.d.ts'))
    .pipe(gulp.dest('dist/pinus'));
})
