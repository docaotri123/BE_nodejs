const gulp = require('gulp');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');

gulp.task('mocha', () => {
    return gulp.src(['src/service/*.spec.ts'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log)
})