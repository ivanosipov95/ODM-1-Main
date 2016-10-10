'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import less from 'gulp-less';
import csso from 'gulp-csso';
import uglify from 'gulp-uglify';
import gulpIf from 'gulp-if';
import rigger from 'gulp-rigger';
import runSequence from 'gulp-run-sequence';
import imagemin from 'gulp-imagemin';
import debug from 'gulp-debug';
import del from 'del';
import browserSync from 'browser-sync';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

const paths = {
    src: {
        html: './assets/**/*.html',
        script: './assets/**/*.js',
        style: './assets/**/*.less',
        font: './assets/**/*.*{ttf,otf}',
        img: './assets/**/*.png'
    },
    build: {
        html: './build',
        script: './build',
        style: './build',
        font: './build',
        img: './build'
    },
    watch: {
        html: './assets/*.html',
        script: './assets/**/*.js',
        style: './assets/**/*.less',
        font: './assets/**/*.*{ttf,otf}',
        img: './assets/**/*.png'
    },
    clean: './build'
};

gulp.task('styles', () => {
    return gulp.src(paths.src.style)
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(less())
        .pipe(csso())
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest(paths.build.style));
});

gulp.task('assets', () => {
    return gulp.src(paths.src.html)
        .pipe(debug({title: 'assets'}))
        .pipe(gulp.dest(paths.build.html));
});

gulp.task('scripts', () => {
    return gulp.src(paths.src.script)
        .pipe(rigger())
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest(paths.build.script));
});

gulp.task('fonts', () => {
    return gulp.src(paths.src.font)
        .pipe(gulp.dest(paths.build.font));
});

gulp.task('img', () => {
    return gulp.src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.build.img));
});

gulp.task('clean', () => {
    return del(paths.clean);
});

gulp.task('server', () => {
    browserSync.init({
        server: 'build'
    });

    browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});

gulp.task('watch', () => {
    gulp.watch(paths.watch.style, ['styles']);
    gulp.watch(paths.watch.script, ['scripts']);
    gulp.watch(paths.watch.html, ['assets']);
    gulp.watch(paths.watch.font, ['fonts']);
    gulp.watch(paths.watch.img, ['img']);
});

gulp.task('build', (cb) => {
    runSequence('clean', ['styles', 'scripts', 'fonts', 'img'], 'assets', 'watch', cb);
});

gulp.task('default', (cb) => {
    runSequence('build', 'server', 'watch', cb);
});
