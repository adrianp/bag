const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const gls = require('gulp-live-server');
const gulp = require('gulp');
const eslint = require('gulp-eslint');


const paths = {
    'serverSrc': './src/server/**/*.js',
    'wwwJsSrc': './src/www/js/**/*.js'
};

gulp.task('copy', () => {
    // copy EJS templates from ./src/ to ./bin/, no massaging required
    gulp.src('./src/www/html/**/*.ejs')
        .pipe(gulp.dest('bin/www/html/'));

    // copy server configuration file
    gulp.src('./config.json')
        .pipe(gulp.dest('bin/'));
});

gulp.task('lintWWW', () => {
    return gulp.src(paths.wwwJsSrc)
                .pipe(eslint())  // check
                .pipe(eslint.format())  // output
                .pipe(eslint.failAfterError());  // possibly fail
});

gulp.task('babelWWW', () => {
    return gulp.src(paths.wwwJsSrc)
        .pipe(babel())  // ES6 -> ES5
        .pipe(browserify())  // bundle external dependencies
        .pipe(gulp.dest('./bin/www/js/'));  // place everything in ./bin/
});

gulp.task('lintServer', () => {
    return gulp.src(paths.serverSrc)
                .pipe(eslint())  // check
                .pipe(eslint.format())  // output
                .pipe(eslint.failAfterError());  // possibly fail
});

gulp.task('babelServer', () => {
    return gulp.src(paths.serverSrc)
        .pipe(babel())  // ES6 -> ES5
        .pipe(gulp.dest('./bin/'));  // place everything in ./bin/
});

gulp.task('watch', () => {
    // run the Express.js server
    const server = gls('./bin/index.js');
    server.start();

    // if server code changes, re-compile it using Babel
    gulp.watch(paths.serverSrc, ['lintServer', 'babelServer', 'copy']);

    // if www code changes, re-compile it using Babel and copy stuff around
    gulp.watch('./src/www/**/*', ['lintWWW', 'babelWWW', 'copy']);

    // when www code changes, notify the browser for live reload
    gulp.watch('bin/www/**/*', (file) => {
        server.notify(file);
    });

    // when server code changes, restart the server and notify the browser for
    // live reload
    gulp.watch('./bin/**/*.js', (file) => {
        server.start();
        server.notify(file);
    });
});

gulp.task('default', [
    'lintServer',
    'babelServer',
    'lintWWW',
    'babelWWW',
    'copy'
]);

gulp.task('build', [
    'babelServer',
    'babelWWW',
    'copy'
]);
