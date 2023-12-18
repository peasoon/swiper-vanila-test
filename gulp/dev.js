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
import imagemin, { svgo } from "gulp-imagemin";
import changed from "gulp-changed";
import sassGlob from "gulp-sass-glob";
import newer from "gulp-newer";

const fullSass = gulpSass(sass);

gulp.task("html:dev", () => {
  return (
    gulp
      .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
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
      //.pipe(newer("./build"))
      .pipe(gulp.dest("./build"))
  );
});

gulp.task("scss:dev", () => {
  return (
    gulp
      .src("./src/scss/*.scss")
      .pipe(changed("./build/css/"))
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
      .pipe(sassGlob())
      .pipe(fullSass())
      //.pipe(groupMedia())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./build/css/"))
  );
});

gulp.task("images:dev", () => {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./build/img"))
    .pipe(
      imagemin(
        [
          svgo({
            plugins: [
              {
                name: "removeViewBox",
                active: false,
              },
              {
                name: "cleanupIDs",
                active: false,
              },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(gulp.dest("./build/img"));
});

gulp.task("fonts:dev", () => {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./build/fonts"))
    .pipe(gulp.dest("./build/fonts"));
});

gulp.task("files:dev", () => {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files"))
    .pipe(gulp.dest("./build/files"));
});

gulp.task("js:dev", () => {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./build/js"))
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
    .pipe(gulp.dest("./build/js"));
});

gulp.task("startServer:dev", () => {
  return gulp.src("./build/").pipe(
    server({
      livereload: true,
      open: false,
    })
  );
});

gulp.task("clean:dev", (cb) => {
  if (fs.existsSync("./build/")) {
    return gulp.src("./build/", { read: false }).pipe(clean({ force: true }));
  }
  cb();
});

gulp.task("watch:dev", () => {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("scss:dev"));
  gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/img/**/*", gulp.parallel("images:dev"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*.ts", gulp.parallel("js:dev"));
});
