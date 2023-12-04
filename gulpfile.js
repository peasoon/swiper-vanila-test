import gulp from "gulp";
import "./gulp/dev.js";
import "./gulp/docs.js";

gulp.task(
  "default",
  gulp.series(
    "clean:dev",
    gulp.parallel(
      "scss:dev",
      "html:dev",
      "images:dev",
      "fonts:dev",
      "files:dev",
      "js:dev"
    ),
    gulp.parallel("startServer:dev", "watch:dev")
  )
);

gulp.task(
  "docs",
  gulp.series(
    "clean:docs",
    gulp.parallel(
      "scss:docs",
      "html:docs",
      "images:docs",
      "fonts:docs",
      "files:docs",
      "js:docs"
    ),
    gulp.parallel("startServer:docs", "watch:docs")
  )
);
