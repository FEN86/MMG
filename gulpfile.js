let gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cssmin = require('gulp-cssmin'),
  wait = require('gulp-wait'),
  del = require("del");


gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(wait(100))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer({
      grid: true,
      overrideBrowserslist: ["last 15 versions", "> 1%", "ie 8", "ie 7"]
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('html', function () {
  return gulp.src('app/**/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('script', function () {
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.min.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});

gulp.task('css-libs', function () {
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css'
  ])
    .pipe(concat('libs.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('app/css'))
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app/"
    },
    notify: false
  });
});

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'))
  gulp.watch('app/**/*.html', gulp.parallel('html'))
  gulp.watch('app/js/**/*.js', gulp.parallel('js'))
});

gulp.task("clean", async function () {
  del.sync("dist");
});

gulp.task("export", function () {
  let buildHtml = gulp.src("app/**/*.html").pipe(gulp.dest("dist"));

  let buildCss = gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css"));

  let buildJs = gulp.src("app/js/**/*.js").pipe(gulp.dest("dist/js"));

  let buildFonts = gulp.src("app/fonts/**/*.*").pipe(gulp.dest("dist/fonts"));

  let buildImg = gulp.src("app/images/**/*.*").pipe(gulp.dest("dist/images"));
});

gulp.task('default', gulp.parallel('css-libs', 'script', 'sass', 'watch', 'browser-sync'));

gulp.task("build", gulp.series("clean", "export"));
