import gulp from 'gulp'
import clean from 'gulp-clean'
import tsc from 'gulp-typescript'
import path from 'path'
import swc from 'gulp-swc'
import esbuild from 'gulp-esbuild'
import watch from 'gulp-watch'

import config from './config'

const {
  srcPath,
  esbuildOptions,
  swcOptions,
  bundleInDemoPath,
  bundlePath,
  typesPath,
  tsConfigPath,
  swcBuildPath,
  entry,
} = config

const genTsc = () => {
  return tsc.createProject(tsConfigPath)
}

gulp.task('clean-dev-bundle', () => {
  return gulp.src(bundleInDemoPath, { allowEmpty: true }).pipe(clean())
})

gulp.task('clean-demo-dev-bundle', () => {
  return gulp.src(bundleInDemoPath, { allowEmpty: true }).pipe(clean())
})

gulp.task('clean-bundle', () => {
  return gulp.src(bundlePath, { allowEmpty: true }).pipe(clean())
})

gulp.task('clean-dts', () => {
  return gulp.src(typesPath, { allowEmpty: true }).pipe(clean())
})

gulp.task('gen-dts', () => {
  const tsc = genTsc()
  return tsc.src().pipe(tsc()).pipe(gulp.dest(typesPath))
})

gulp.task('swc-ts-2-js', () => {
  return gulp.src(path.resolve(srcPath, '*.ts')).pipe(swc(swcOptions)).pipe(gulp.dest(swcBuildPath))
})

gulp.task('esbuild-bundle', () => {
  return gulp
    .src(path.resolve(swcBuildPath, `${entry}.js`))
    .pipe(esbuild(esbuildOptions))
    .pipe(gulp.dest(bundlePath))
})

gulp.task('esbuild-bundle-dev', () => {
  return gulp
    .src(path.resolve(swcBuildPath, `${entry}.js`))
    .pipe(esbuild({ ...esbuildOptions, minify: false, outfile: 'index.dev.js' }))
    .pipe(gulp.dest(bundlePath))
})

gulp.task('copy-2-demo', () => {
  return gulp.src(path.resolve(swcBuildPath, '*.js')).pipe(gulp.dest(bundleInDemoPath))
})

gulp.task('watch', () => {
  const tsFile = path.resolve(srcPath, '*.ts')
  const watcher = watch(tsFile, gulp.series('dev'))
  watcher.on('change', function (path, stats) {
    console.log(`File ${path} was changed`)
  })
})

// build for develop
gulp.task(
  'dev',
  gulp.series(
    'clean-dev-bundle',
    'clean-demo-dev-bundle',
    'swc-ts-2-js',
    'esbuild-bundle-dev',
    'copy-2-demo',
  ),
)

// build for develop & watch
gulp.task('dev-watch', gulp.series('dev', 'watch'))
// generate .d.ts
gulp.task('dts', gulp.series('clean-dts', 'gen-dts'))
// build for publish
gulp.task('default', gulp.series('clean-bundle', 'swc-ts-2-js', 'esbuild-bundle', 'dts'))
