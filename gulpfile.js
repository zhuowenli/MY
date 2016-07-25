/**
 * @author: 卓文理
 * @email : 531840344@qq.com
 * @desc  : Description
 */
'use strict';

const source = require('vinyl-source-stream');
const babelify = require('babelify');
const browserify = require('browserify');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const path = require('path');

gulp.task('browserify', function(){
    return browserify({
            entries: 'src/MY.js',
            // debug: true
        })
        .transform(babelify)
        .bundle()
        .pipe(plumber({errorHandler: function(e){console.log(e);this.emit('end');}}))
        .pipe(source('MY.js'))
        .pipe(gulp.dest('dist'));
});

// watch
gulp.task('default', function(){
    gulp.watch('src/**/*.js', ['browserify']);
});