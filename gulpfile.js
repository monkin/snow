/*jshint node: true*/

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    webserver = require("gulp-webserver"),
    gulptsc = require("gulp-tsc"),
    to_json = require("gulp-files-to-json"),
    header = require("gulp-header");

gulp.task("default", ["build", "release", "watch", "server"]);
gulp.task("build", ["build-js", "build-html", "build-glsl"]);

gulp.task("build-js", function() {
    gulp.src(["src/**/*.ts"])
        .pipe(gulptsc({ out: "script.js" }))
        .pipe(gulp.dest('build'));
});

gulp.task("build-glsl", function() {
    gulp.src("src/shaders/*.glsl")
        .pipe(to_json("glsl.js"))
        .pipe(header("snow.Shaders = "))
        .pipe(gulp.dest("build"));
});

gulp.task("build-html", function() {
    gulp.src("src/index.html").pipe(gulp.dest("build"));
});

gulp.task("release", function() {
    gulp.src("build/*").pipe(gulp.dest("../snow-release"));
});

gulp.task("watch", function() {
    gulp.watch("src/**/*.ts", ["build-js"]);
    gulp.watch("src/**/*.glsl", ["build-glsl"]);
    gulp.watch("src/index.html", ["build-html"]);
    gulp.watch("build/*", ["release"]);
});

gulp.task("server", function() {
    gulp.src('build')
        .pipe(webserver({
            port: 8080,
            livereload: true
        }));
});