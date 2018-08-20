const path = require('path')

const gulp = require('gulp')
const clean = require('gulp-clean')
const less = require('gulp-less')
const rename = require('gulp-rename')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const webpack = require('webpack')
const gulpInstall = require('gulp-install')

const config = require('./config')
const checkComponents = require('./checkcomponents')
const _ = require('./utils')

const wxssConfig = config.wxss || {}
const srcPath = config.srcPath
const distPath = config.distPath

/**
 * get wxss stream
 */
function wxss(wxssFileList) {
  if (!wxssFileList.length) return false

  return gulp.src(wxssFileList, {cwd: srcPath, base: srcPath})
    .pipe(gulpif(wxssConfig.less && wxssConfig.sourcemap, sourcemaps.init()))
    .pipe(gulpif(wxssConfig.less, less({paths: [srcPath]})))
    .pipe(rename({extname: '.wxss'}))
    .pipe(gulpif(wxssConfig.less && wxssConfig.sourcemap, sourcemaps.write('./')))
    .pipe(_.logger(wxssConfig.less ? 'generate' : undefined))
    .pipe(gulp.dest(distPath))
}

/**
 * get js stream
 */
function js(jsFileMap, scope) {
  const webpackConfig = config.webpack
  const webpackCallback = (err, stats) => {
    if (!err) {
      // eslint-disable-next-line no-console
      console.log(stats.toString({
        assets: true,
        cached: false,
        colors: true,
        children: false,
        errors: true,
        warnings: true,
        version: true,
        modules: false,
        publicPath: true,
      }))
    } else {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  webpackConfig.entry = jsFileMap
  webpackConfig.output.path = distPath

  if (scope.webpackWatcher) {
    scope.webpackWatcher.close()
    scope.webpackWatcher = null
  }

  if (config.isWatch) {
    scope.webpackWatcher = webpack(webpackConfig).watch({
      ignored: /node_modules/,
    }, webpackCallback)
  } else {
    webpack(webpackConfig).run(webpackCallback)
  }
}

/**
 * copy file
 */
function copy(copyFileList) {
  if (!copyFileList.length) return false

  return gulp.src(copyFileList, {cwd: srcPath, base: srcPath})
    .pipe(_.logger())
    .pipe(gulp.dest(distPath))
}

/**
 * install packages
 */
function install() {
  return gulp.series(async () => {
    const demoDist = config.demoDist
    const demoPackageJsonPath = path.join(demoDist, 'package.json')
    const packageJson = _.readJson(path.resolve(__dirname, '../package.json'))
    const dependencies = packageJson.dependencies || {}

    await _.writeFile(demoPackageJsonPath, JSON.stringify({dependencies}, null, '\t')) // write dev demo's package.json
  }, () => {
    const demoDist = config.demoDist
    const demoPackageJsonPath = path.join(demoDist, 'package.json')

    return gulp.src(demoPackageJsonPath)
      .pipe(gulpInstall({production: true}))
  })
}

class BuildTask {
  constructor(id, entry) {
    if (!entry) return

    this.id = id
    this.entries = Array.isArray(config.entry) ? config.entry : [config.entry]
    this.copyList = Array.isArray(config.copy) ? config.copy : []
    this.componentListMap = {}
    this.cachedComponentListMap = {}

    this.init()
  }

  init() {
    const id = this.id

    /**
     * clean the dist folder
     */
    gulp.task(`${id}-clean-dist`, () => gulp.src(distPath, {read: false, allowEmpty: true}).pipe(clean()))

    /**
     * copy demo to the dev folder
     */
    let isDemoExists = false
    gulp.task(`${id}-demo`, gulp.series(async () => {
      const demoDist = config.demoDist

      isDemoExists = await _.checkFileExists(path.join(demoDist, 'project.config.json'))
    }, done => {
      if (!isDemoExists) {
        const demoSrc = config.demoSrc
        const demoDist = config.demoDist

        return gulp.src('**/*', {cwd: demoSrc, base: demoSrc})
          .pipe(gulp.dest(demoDist))
      }

      return done()
    }))

    /**
     * install packages for dev
     */
    gulp.task(`${id}-install`, install())

    /**
     * check custom components
     */
    gulp.task(`${id}-component-check`, async () => {
      const entries = this.entries
      const mergeComponentListMap = {}
      for (let i = 0, len = entries.length; i < len; i++) {
        let entry = entries[i]
        entry = path.join(srcPath, `${entry}.json`)
        // eslint-disable-next-line no-await-in-loop
        const newComponentListMap = await checkComponents(entry)

        _.merge(mergeComponentListMap, newComponentListMap)
      }

      this.cachedComponentListMap = this.componentListMap
      this.componentListMap = mergeComponentListMap
    })

    /**
     * write json to the dist folder
     */
    gulp.task(`${id}-component-json`, done => {
      const jsonFileList = this.componentListMap.jsonFileList

      if (jsonFileList && jsonFileList.length) {
        return copy(this.componentListMap.jsonFileList)
      }

      return done()
    })

    /**
     * copy wxml to the dist folder
     */
    gulp.task(`${id}-component-wxml`, done => {
      const wxmlFileList = this.componentListMap.wxmlFileList

      if (wxmlFileList &&
        wxmlFileList.length &&
        !_.compareArray(this.cachedComponentListMap.wxmlFileList, wxmlFileList)) {
        return copy(wxmlFileList)
      }

      return done()
    })

    /**
     * generate wxss to the dist folder
     */
    gulp.task(`${id}-component-wxss`, done => {
      const wxssFileList = this.componentListMap.wxssFileList

      if (wxssFileList &&
        wxssFileList.length &&
        !_.compareArray(this.cachedComponentListMap.wxssFileList, wxssFileList)) {
        return wxss(wxssFileList, srcPath, distPath)
      }

      return done()
    })

    /**
     * generate js to the dist folder
     */
    gulp.task(`${id}-component-js`, done => {
      const jsFileList = this.componentListMap.jsFileList

      if (jsFileList &&
        jsFileList.length &&
        !_.compareArray(this.cachedComponentListMap.jsFileList, jsFileList)) {
        js(this.componentListMap.jsFileMap, this)
      }

      return done()
    })

    /**
     * copy resources to dist folder
     */
    gulp.task(`${id}-copy`, gulp.parallel(done => {
      const copyList = this.copyList
      const copyFileList = copyList.map(dir => path.join(dir, '**/*.!(wxss)'))

      if (copyFileList.length) return copy(copyFileList)

      return done()
    }, done => {
      const copyList = this.copyList
      const copyFileList = copyList.map(dir => path.join(dir, '**/*.wxss'))

      if (copyFileList.length) return wxss(copyFileList, srcPath, distPath)

      return done()
    }))

    /**
     * watch json
     */
    gulp.task(`${id}-watch-json`, () => gulp.watch(this.componentListMap.jsonFileList, {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-check`, gulp.parallel(`${id}-component-wxml`, `${id}-component-wxss`, `${id}-component-js`, `${id}-component-json`))))

    /**
     * watch wxml
     */
    gulp.task(`${id}-watch-wxml`, () => {
      this.cachedComponentListMap.wxmlFileList = null
      return gulp.watch(this.componentListMap.wxmlFileList, {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-wxml`))
    })

    /**
     * watch wxss
     */
    gulp.task(`${id}-watch-wxss`, () => {
      this.cachedComponentListMap.wxssFileList = null
      return gulp.watch('**/*.wxss', {cwd: srcPath, base: srcPath}, gulp.series(`${id}-component-wxss`))
    })

    /**
     * watch resources
     */
    gulp.task(`${id}-watch-copy`, () => {
      const copyList = this.copyList
      const copyFileList = copyList.map(dir => path.join(dir, '**/*'))
      const watchCallback = filePath => copy([filePath])

      return gulp.watch(copyFileList, {cwd: srcPath, base: srcPath})
        .on('change', watchCallback)
        .on('add', watchCallback)
        .on('unlink', watchCallback)
    })

    /**
     * watch demo
     */
    gulp.task(`${id}-watch-demo`, () => {
      const demoSrc = config.demoSrc
      const demoDist = config.demoDist
      const watchCallback = filePath => gulp.src(filePath, {cwd: demoSrc, base: demoSrc})
        .pipe(gulp.dest(demoDist))

      return gulp.watch('**/*', {cwd: demoSrc, base: demoSrc})
        .on('change', watchCallback)
        .on('add', watchCallback)
        .on('unlink', watchCallback)
    })

    /**
     * watch installed packages
     */
    gulp.task(`${id}-watch-install`, () => gulp.watch(path.resolve(__dirname, '../package.json'), install()))

    /**
     * build custom component
     */
    gulp.task(`${id}-build`, gulp.series(`${id}-clean-dist`, `${id}-component-check`, gulp.parallel(`${id}-component-wxml`, `${id}-component-wxss`, `${id}-component-js`, `${id}-component-json`, `${id}-copy`)))

    gulp.task(`${id}-watch`, gulp.series(`${id}-build`, `${id}-demo`, `${id}-install`, gulp.parallel(`${id}-watch-wxml`, `${id}-watch-wxss`, `${id}-watch-json`, `${id}-watch-copy`, `${id}-watch-install`, `${id}-watch-demo`)))

    gulp.task(`${id}-dev`, gulp.series(`${id}-build`, `${id}-demo`, `${id}-install`))

    gulp.task(`${id}-default`, gulp.series(`${id}-build`))
  }
}

module.exports = BuildTask
