import gulp from 'gulp'
import clean from 'gulp-clean'
import config from './config'

const {
  srcPath,
  demoPath,
  esbuildOptions,
  swcOptions,
} = config;

// // clean the generated folders and files
// gulp.task('clean', gulp.series(() => gulp.src(config.distPath, {read: false, allowEmpty: true}).pipe(clean()), done => {
//   if (config.isDev) {
//     return gulp.src(config.demoDist, {read: false, allowEmpty: true})
//       .pipe(clean())
//   }
//   return done()
// }))

// // watch files and build
// gulp.task('watch', gulp.series(`${id}-watch`))
// build for develop
gulp.task('dev', gulp.series('clean-dev-bundle', ''))
// // build for publish
// gulp.task('default', gulp.series(`${id}-default`))
// gulp.task('swc_build', gulp.series(`${id}-swc_build`))