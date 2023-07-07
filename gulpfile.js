const { src, dest, watch, parallel, series } = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
}
// основные стили
function styles() {
    return src('app/scss/style.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: [
                "> 1%",
                "ie >= 8",
                "edge >= 15",
                "ie_mob >= 10",
                "ff >= 45",
                "chrome >= 45",
                "safari >= 7",
                "opera >= 23",
                "ios >= 7",
                "android >= 4",
                "bb >= 10"
            ],
            grid: true
        }))
        .pipe(dest('../local/templates/main/assets/css'))
        .pipe(browserSync.stream())
}
// медиа файл
function media() {
    return src('app/scss/media.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('media.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: [
                "> 1%",
                "ie >= 8",
                "edge >= 15",
                "ie_mob >= 10",
                "ff >= 45",
                "chrome >= 45",
                "safari >= 7",
                "opera >= 23",
                "ios >= 7",
                "android >= 4",
                "bb >= 10"],
            grid: true
        }))
        .pipe(dest('../local/templates/main/assets//css'))
        .pipe(browserSync.stream())
}
function img() {
    return src('app/images/**/*')
        .pipe(imagemin(
            [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
        .pipe(dest('dist/images'))
}
function cleanDist() {
    return del('dist')
}

function sripts() {
    return src([
        'app/local/templates/main/assets/js/main.js',
        'node_modules/swiper/swiper.js'
    ])
        .pipe(concat('app/local/templates/main/assets/js/main.js'))
        .pipe(uglify())
        .pipe(dest('../local/tempplates/main/assets/js/main.js'))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'app/css/style.css',
        'app/css/media.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html',
    ], { base: 'app' })
        .pipe(dest('dist'));
}


function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/scss/**/*.scss'], media);
    // cледить за всеми, кроме мин js
    watch(['../local/templates/main/assets/js/**/*.js', '!../local/templates/main/assets/js/**/main.min.js'], sripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}



exports.styles = styles;
exports.media = media;
exports.watching = watching;
exports.browsersync = browsersync;
exports.sripts = sripts;
exports.cleanDist = cleanDist;
exports.img = img;

// gulp build
exports.build = series(cleanDist, img, build);
// gulp
exports.default = parallel(styles, media, browsersync, watching, sripts);