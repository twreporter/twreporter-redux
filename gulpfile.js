const gulp = require('gulp')
const rimraf = require('rimraf')
const path = require('path')
const babel = require('gulp-babel')
const fs = require('fs')

const babelOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, './.babelrc'), 'utf8'))

const clean = target => cb => rimraf(target, { glob: false }, cb)

gulp.task(
  'clean-build',
  clean(path.resolve(__dirname, './lib')))

gulp.task(
  'babel-src',
  () => {
    return gulp
      .src(path.resolve(__dirname, './src/**'), { base: path.resolve(__dirname, './src') })
      .pipe(babel(babelOptions))
      .pipe(gulp.dest(path.resolve(__dirname, './lib')))
  })

let customerFolder = process.env.CUSTOMER_FOLDER
if (typeof customerFolder !== 'string') {
  customerFolder = path.resolve(__dirname, '../twreporter-react')
}
const destFolder = `${customerFolder}/node_modules/twreporter-redux/lib`

gulp.task(
  'clean-customer-folder',
  clean(destFolder))

gulp.task(
  'copy-lib-to-customer-folder',
  () => {
    return gulp
      .src('./lib/**', { base: './lib' })
      .pipe(gulp.dest(destFolder))
  })

gulp.task('build-to-customer-folder',
  gulp.series('clean-build', 'babel-src', 'clean-customer-folder', 'copy-lib-to-customer-folder'))

gulp.task('watch', () => {
  const watcher = gulp.watch(['src/**', 'node_modules/**'], { delay: 500 }, gulp.series(['build-to-customer-folder']))
  watcher.on('change', (filePath) => {
    console.log(`File ${filePath} was changed, running tasks...`)
  })
})
