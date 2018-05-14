const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();

// styles
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');

// images
const imagemin = require('gulp-imagemin');

// create path
const paths = {
	root: './build',
	pages: {
		src: 'src/pages/**/*.html',
		dest: 'build/assets/'
	},
	styles: {
		src: 'src/styles/**/*.scss',
		dest: 'build/assets/styles/'
	},

	images: {
		src: 'src/img/**/*.+(jpg|jpeg|png|gif)',
		dest: 'build/assets/img/'
	},

	favicon: {
		src: 'src/img/favicon/*.*',
		dest: './build'
	},

	fonts: {
		src: 'src/fonts/**/*.*',
		dest: 'build/assets/fonts/'
	},
};

// html
function pages() {
	return gulp.src('./src/pages/**/*.html')
		.pipe(gulp.dest(paths.root));
}

// css
function styles() {
	return gulp.src('./src/styles/main.scss')
		.pipe(sass({
			includePaths: require('node-normalize-scss').includePaths,
			outputStyle: 'compressed'
		}))

		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(paths.styles.dest))
}

// move images
function images() {
	return gulp.src(paths.images.src)
		.pipe(imagemin(
			[
				imagemin.gifsicle({ interlaced: true }, { optimizationLevel: 3 }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 })
			]
		)
		)
		.pipe(gulp.dest(paths.images.dest));
}

// move favicon
function favicon() {
	return gulp.src('./src/img/favicon/*.*')
		.pipe(gulp.dest(paths.root));
}

// move fonts
function fonts() {
	return gulp.src(paths.fonts.src)
		.pipe(gulp.dest(paths.fonts.dest));
}

// clear build
function clean() {
	return del(paths.root);
}

// rename & move htaccess
function htaccess() {
	return gulp.src('./src/ht.access')
		.pipe(rename('.htaccess'))
		.pipe(gulp.dest(paths.root));
}

// watch for src and run tasks
function watch() {
	gulp.watch(paths.pages.src, pages);
	gulp.watch(paths.styles.src, styles);
	gulp.watch(paths.images.src, images);
	gulp.watch(paths.favicon.src, favicon);
	gulp.watch(paths.fonts.src, fonts);
}

// watching for build & reload browser
function server() {
	browserSync.init({
		server: paths.root,
		browser: ["chrome",
			//"firefox",
			//"opera",
			//"microsoft-edge:http://localhost:3000",
			"iexplore"
		],
		notify: false
	});
	browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

// exporting functions for console access
exports.clean = clean;
exports.watch = watch;
exports.server = server;
exports.pages = pages;
exports.styles = styles;
exports.images = images;
exports.fonts = fonts;

// development
gulp.task('default', gulp.series(
	gulp.parallel(pages, styles, images, favicon, fonts, htaccess),
	gulp.parallel(watch, server)
));

gulp.task('build', gulp.series(
	clean,
	gulp.parallel(pages, styles, images, favicon, fonts, htaccess)
));
