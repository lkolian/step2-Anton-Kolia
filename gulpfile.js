"use strict";

const gulp = require("gulp");
const { series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const imagemin = require("gulp-imagemin");
const postcss = require("gulp-postcss");
const uncss = require("postcss-uncss");
const uglify = require("gulp-uglify");
const pipeline = require("readable-stream").pipeline;

const cleanDist = function () {
	return gulp.src("dist/*", { read: false }).pipe(clean());
};

const images = function () {
	return gulp
		.src("./src/img/*.+(png|jpg|jpeg|gif|svg)")
		.pipe(
			imagemin({
				interlaced: true,
			})
		)
		.pipe(gulp.dest("dist/img"));
};

const buildSass = function () {
	return gulp
		.src("src/scss/**/*.scss")
		.pipe(sass())
		.pipe(concat("styles.min.css"))
		.pipe(autoprefixer(["> 0.1%"], { cascade: true }))
		.pipe(gulp.dest("./dist/styles"))
		.pipe(browserSync.stream());
};

const buildJs = function () {
	return gulp
		.src("src/js/*.js")
		.pipe(concat("script.min.js"))
		.pipe(uglify({ toplevel: true }))
		.pipe(gulp.dest("./dist/js"));
};

const minifyCss = function () {
	return gulp
		.src("dist/styles/**/*.css")
		.pipe(cleanCSS({ compatibility: "ie8" }))
		.pipe(gulp.dest("./dist/styles"));
};

gulp.task("moveImg", () => {
	return gulp.src("src/img/*.jpg").pipe(gulp.dest("dist/img"));
});

gulp.task("dev", function () {
	browserSync.init({
		server: "./",
	});
	gulp.watch("src/scss/**/*.scss", buildSass);
	gulp.watch("index.html").on("change", browserSync.reload);
	gulp.watch("src/js/*.js", buildJs);
});

gulp.task("moveImg", () => {
	return gulp.src("src/img/*.jpg").pipe(gulp.dest("dist/img"));
});

gulp.task("build", series(cleanDist, buildSass, minifyCss, buildJs, images));
