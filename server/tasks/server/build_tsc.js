'use strict';

import gulp from 'gulp';
import tsc from 'gulp-typescript';
import connect from 'gulp-connect';

const TS_CONFIG = './tsconfig.json';

gulp.task('src.compile_tsc', () => {
  let tsconfigSrc = tsc.createProject(TS_CONFIG);

  return tsconfigSrc.src()
                    .pipe(tsconfigSrc())
                    .js
                    .pipe(gulp.dest('./server'))
                    .pipe(connect.reload());
});

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('copy', () => gulp
  .src(['src/**/*.json'])
  .pipe(gulp.dest('./server'))
);

gulp.task('watch', () => {
  gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['src.compile_tsc']);
});

gulp.task('default', ['connect','watch']);
