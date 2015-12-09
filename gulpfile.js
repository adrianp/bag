const babel = require('gulp-babel');
const gls = require('gulp-live-server');
const gulp = require('gulp');


const paths = {
    'server': {
        'src': './src/server/**/*.js',
        'bin': './bin/server/',
        'entry': './bin/server/index.js',
        'watch': './bin/server/**/*.js'
    }
};

gulp.task('babelServer', () => {
    return gulp.src(paths.server.src)
        .pipe(babel())
        .pipe(gulp.dest(paths.server.bin));
});

gulp.task('server', () => {
    const server = gls(paths.server.entry, null, 35729);
    server.start();
    gulp.watch(paths.server.src, ['babelServer']);
    gulp.watch(paths.server.watch, (file) => {
        server.start();
        server.notify(file);
    });
});

gulp.task('default', ['babelServer']);
