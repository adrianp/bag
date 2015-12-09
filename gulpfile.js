const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const gls = require('gulp-live-server');
const gulp = require('gulp');


const paths = {
    'bin': './bin/',
    'server': {
        'src': './src/server/**/*.js',
        'entry': './bin/index.js',
        'watch': './bin/**/*.js'
    },
    'www': {
        'js': {
            'entry': './src/www/js/**/*.js'
        },
        'html': {
            'entry': './src/www/html/**/*.ejs'
        },
        'src': './src/www/**/*',
        'jsbin': './bin/www/js/',
        'watch': 'bin/www/**/*',
        'entry': 'bin/www/html/'
    }
};

gulp.task('copyWWW', () => {
    gulp.src(paths.www.html.entry)
        .pipe(gulp.dest(paths.www.entry));
});

gulp.task('babelWWW', () => {
    return gulp.src(paths.www.js.entry)
        .pipe(babel())
        .pipe(browserify())
        .pipe(gulp.dest(paths.www.jsbin));
});

gulp.task('babelServer', () => {
    return gulp.src(paths.server.src)
        .pipe(babel())
        .pipe(gulp.dest(paths.bin));
});

gulp.task('watch', () => {
    const server = gls(paths.server.entry);
    server.start();

    gulp.watch(paths.server.src, ['babelServer']);

    gulp.watch(paths.www.src, ['babelWWW', 'copyWWW']);

    gulp.watch(paths.www.watch, (file) => {
        server.notify(file);
    });

    gulp.watch(paths.server.watch, (file) => {
        server.start();
        server.notify(file);
    });
});

gulp.task('default', ['babelServer', 'babelWWW', 'copyWWW']);
