const path = require("path");
const gulp = require("gulp");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const gulpif = require("gulp-if");
// const sourcemaps = require("gulp-sourcemaps");
const gulpInstall = require("gulp-install");
const config = require("./config");
const _ = require("./utils");
const tsc = require("gulp-typescript");
const swc = require("gulp-swc");
const gulpEsbuild = require("gulp-esbuild");

const srcPath = config.srcPath;
const distPath = config.distPath;
const swcBuildPath = config.swcBuildPath;

const swcOptions = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: false,
      decorators: false,
      dynamicImport: false,
    },
    transform: null,
    target: "es5",
    externalHelpers: false,
    keepClassNames: false,
    minify: {
      compress: {
        unused: true,
      },
      mangle: true,
    },
  },
  minify: true,
  module: {
    type: "commonjs",
    strict: false,
    strictMode: true,
    lazy: false,
    noInterop: false,
  },
};

const tscProject = tsc.createProject(
  path.resolve(config.srcPath, "../tsconfig.json")
);


class BuildTask {

  init() {
    const id = this.id;
    /**
     * 清空目标目录
     */
    gulp.task(`${id}-clean-dist`, () =>
      gulp.src(distPath, { read: false, allowEmpty: true }).pipe(clean())
    );

    /**
     * 安装依赖包
     */
    gulp.task(`${id}-install`, install());

    /**
     * 生成 TS 类型文件 d.ts
     */
    gulp.task(`${id}-dts`, () => {
      const { typeDeclare } = config;
      return tscProject.src().pipe(tscProject()).pipe(gulp.dest(typeDeclare));
    });

    gulp.task(`${id}-swc`, () => {
      return gulp
        .src(path.resolve(srcPath, "*.ts"))
        .pipe(swc(swcOptions))
        .pipe(gulp.dest(swcBuildPath));
    });

    gulp.task(`${id}-bundle`, () => {
      return gulp
        .src(path.resolve(swcBuildPath, "index.js"))
        .pipe(
          gulpEsbuild({
            outfile: "index.js",
            bundle: true,
            format: "cjs",
            minify: true,
          })
        )
        .pipe(gulp.dest(distPath));
    });

    /**
     * 监听 ts 变化
     */
    gulp.task(`${id}-watch-ts`, () => {
      this.cachedComponentListMap.tsFileList = null;
      return gulp.watch(
        "**/*.ts",
        { cwd: srcPath, base: srcPath },
        gulp.series(`${id}-component-ts`)
      );
    });

    /**
     * 构建相关任务
     */
    gulp.task(
      `${id}-build`,
      gulp.series(
        `${id}-clean-dist`,
        `${id}-component-check`,
        gulp.parallel(`${id}-component-ts`, `${id}-copy`),
        `${id}-dts`
      )
    );

    gulp.task(
      `${id}-swc_build`,
      gulp.series(`${id}-clean-dist`, `${id}-swc`, `${id}-bundle`, `${id}-dts`)
    );

    gulp.task(
      `${id}-watch`,
      gulp.series(
        `${id}-build`,
        `${id}-demo`,
        `${id}-install`,
        gulp.parallel(
          `${id}-watch-wxml`,
          `${id}-watch-wxss`,
          `${id}-watch-json`,
          `${id}-watch-copy`,
          `${id}-watch-install`,
          `${id}-watch-demo`,
          `${id}-watch-ts`
        )
      )
    );

    gulp.task(
      `${id}-dev`,
      gulp.series(`${id}-build`, `${id}-demo`, `${id}-install`)
    );

    gulp.task(`${id}-default`, gulp.series(`${id}-build`));
  }
}

module.exports = BuildTask;
