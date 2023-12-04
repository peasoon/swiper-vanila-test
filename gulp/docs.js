import gulp from "gulp";
import fileinclude from "gulp-file-include";
import * as sass from "sass";
import gulpSass from "gulp-sass";
import server from "gulp-server-livereload";
import clean from "gulp-clean";
import fs from "fs";
import sourceMaps from "gulp-sourcemaps";
import groupMedia from "gulp-group-css-media-queries";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import webpack from "webpack-stream";
import webpackConfig from "./../webpack.config.js";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";
import sassGlob from "gulp-sass-glob";
import autoprefixer from "gulp-autoprefixer";
import csso from "gulp-csso";
import htmlclean from "gulp-htmlclean";
import webp from "gulp-webp";
import webpHtml from "gulp-webp-html";
import webpCss from "gulp-webp-css";

const fullSass = gulpSass(sass);

gulp.task("html:docs", () => {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./docs"))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "HTML",
          message: "Error <%= error.message %>",
          sound: "false",
        }),
      })
    )
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(webpHtml())
    .pipe(htmlclean())
    .pipe(gulp.dest("./docs"));
});

gulp.task("scss:docs", () => {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./docs/css/"))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Styles",
          message: "Error <%= error.message %>",
          sound: "false",
        }),
      })
    )
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(fullSass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css/"));
});

gulp.task("images:docs", () => {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./docs/img"))
    .pipe(webp())
    .pipe(gulp.dest("./docs/img"))

    .pipe(gulp.src("./src/img/**/*"))
    .pipe(changed("./docs/img"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./docs/img"));
});

gulp.task("fonts:docs", () => {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts"))
    .pipe(gulp.dest("./docs/fonts"));
});

gulp.task("files:docs", () => {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files"))
    .pipe(gulp.dest("./docs/files"));
});

gulp.task("js:docs", () => {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js"))
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Js",
          message: "Error <%= error.message %>",
          sound: "false",
        }),
      })
    )
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest("./docs/js"));
});

gulp.task("startServer:docs", () => {
  return gulp.src("./docs/").pipe(
    server({
      livereload: true,
      open: false,
    })
  );
});

gulp.task("clean:docs", (cb) => {
  if (fs.existsSync("./docs/")) {
    return gulp.src("./docs/", { read: false }).pipe(clean({ force: true }));
  }
  cb();
});

gulp.task("watch:docs", () => {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("scss:docs"));
  gulp.watch("./src/**/*.html", gulp.parallel("html:docs"));
  gulp.watch("./src/img/**/*", gulp.parallel("images:docs"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:docs"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:docs"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:docs"));
});
