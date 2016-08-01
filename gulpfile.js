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

gulp.task('scripts', function(){
    const file = 'src/MY.js';
    const b = browserify(file).transform(babelify);

    return b.bundle()
        .on('error', function(e){
            console.log('--------------------------------');
            console.log('Filepath ' + e.filename);
            console.log(e.loc);
            console.log(e.codeFrame);
            console.log('--------------------------------');
            this.emit('end');
        })
        .pipe(source('MY.js'))
        .pipe(gulp.dest('dist'));
});

// watch
gulp.task('default', function(){
    gulp.watch('src/**/*.js', ['scripts']);
});