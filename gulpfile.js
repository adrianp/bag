const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const eslint = require('gulp-eslint');
const gls = require('gulp-live-server');
const gulp = require('gulp');
const less = require('gulp-less');


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

gulp.task('less', () => {
    return gulp.src('./src/www/css/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./bin/www/css/'));
});

gulp.task('watch', () => {
    // run the Express.js server
    const server = gls('./bin/index.js');
    server.start();

    // if server code changes, re-compile it using Babel
    gulp.watch(paths.serverSrc, ['lintServer', 'babelServer', 'copy']);

    // if www code changes, re-compile it using Babel and copy stuff around
    gulp.watch('./src/www/**/*', ['lintWWW', 'babelWWW', 'less', 'copy']);

    // restart the server and notify livereload on code changes
    gulp.watch('bin/www/**/*', (file) => {
        server.start();
        server.notify(file);
    });
});

gulp.task('default', [
    'lintServer',
    'babelServer',
    'lintWWW',
    'babelWWW',
    'less',
    'copy'
]);

gulp.task('build', [
    'babelServer',
    'babelWWW',
    'less',
    'copy'
]);
