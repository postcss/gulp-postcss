var Stream = require('stream')
var postcss = require('postcss')
var applySourceMap = require('vinyl-sourcemaps-apply')
var gutil = require('gulp-util')
var path = require('path')


module.exports = function (processors, options) {

  if (!Array.isArray(processors)) {
    throw new gutil.PluginError('gulp-postcss', 'Please provide array of postcss processors!')
  }

  var stream = new Stream.Transform({ objectMode: true })

  stream._transform = function (file, encoding, cb) {

    if (file.isNull()) {
      return cb(null, file)
    }

    if (file.isStream()) {
      return handleError('Streams are not supported!')
    }

    // Extend default options
    var opts = Object.assign({
      // Source map is disabled by default
      map: false,
      warn: true,
    }, options)

    opts.from = file.path
    opts.to = opts.to || file.path

    // Generate separate source map for gulp-sourcemap
    if (file.sourceMap) {
      opts.map = { annotation: false }
    }

    postcss(processors)
      .process(file.contents, opts)
      .then(handleResult, handleError)

    function handleResult (result) {
      var map
      var warnings = opts.warn

      delete opts.warn

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

      if(warnings) {
        warnings = result.warnings().join('\n')
        if (warnings) {
          gutil.log('gulp-postcss:', file.relative + '\n' + warnings)
        }
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
}
