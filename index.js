var Stream = require('stream')
var postcss = require('postcss')
var applySourceMap = require('vinyl-sourcemaps-apply')
var gutil = require('gulp-util')
var path = require('path')
var postcssLoadConfig = require('postcss-load-config')


module.exports = withConfigLoader(function (loadConfig) {

  var stream = new Stream.Transform({ objectMode: true })

  stream._transform = function (file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      return handleError('Streams are not supported!')
    }

    // Protect `from` and `map` if using gulp-sourcemap
    var isProtected = file.sourceMap
      ? { from: true, map: true }
      : {}

    var options = {
      from: file.path
    , to: file.path
      // Generate a separate source map for gulp-sourcemap
    , map: file.sourceMap ? { annotation: false } : false
    }

    loadConfig({
      from: options.from
    , to: options.to
    , map: options.map
    })
      .then(function (config) {
        var configOpts = config.options || {}
        // Extend the default options if not protected
        for (var opt in configOpts) {
          if (configOpts.hasOwnProperty(opt) && !isProtected[opt]) {
            options[opt] = configOpts[opt]
          } else {
            gutil.log(
              'gulp-postcss:',
              file.relative + '\nCannot override ' + opt +
              ' option, because it is required by gulp-sourcemap'
            )
          }
        }
        return postcss(config.plugins || [])
          .process(file.contents, options)
      })
      .then(handleResult, handleError)

    function handleResult (result) {
      var map
      var warnings = result.warnings().join('\n')

      file.contents = new Buffer(result.css)

      // Apply source map to the chain
      if (file.sourceMap) {
        map = result.map.toJSON()
        map.file = file.relative
        map.sources = [].map.call(map.sources, function (source) {
          return path.join(path.dirname(file.relative), source)
        })
        applySourceMap(file, map)
      }

      if (warnings) {
        gutil.log('gulp-postcss:', file.relative + '\n' + warnings)
      }

      setImmediate(function () {
        cb(null, file)
      })
    }

    function handleError (error) {
      var errorOptions = { fileName: file.path, showStack: true }
      if (error.name === 'CssSyntaxError') {
        error = error.message + '\n\n' + error.showSourceCode() + '\n'
        errorOptions.showStack = false
      }
      // Prevent stream’s unhandled exception from
      // being suppressed by Promise
      setImmediate(function () {
        cb(new gutil.PluginError('gulp-postcss', error, errorOptions))
      })
    }

  }

  return stream
})


function withConfigLoader(cb) {
  return function (plugins, options) {
    if (typeof plugins === 'undefined') {
      return cb(postcssLoadConfig)
    } else if (Array.isArray(plugins)) {
      return cb(function () {
        return Promise.resolve({
          plugins: plugins
        , options: options
        })
      })
    } else {
      throw new gutil.PluginError(
        'gulp-postcss',
        'Please provide array of postcss processors!'
      )
    }
  }
}
