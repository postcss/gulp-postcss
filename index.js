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

    if (file.isStream()) {
      return handleError('Streams are not supported!')
    }

    // Source map is disabled by default
    var opts = { map: false }
    var attr
    var processor = postcss()

    // Extend default options
    if (options) {
      for (attr in options) {
        if (options.hasOwnProperty(attr)) {
          opts[attr] = options[attr]
        }
      }
    }

    opts.from = file.path

    // Generate separate source map for gulp-sourcemap
    if (file.sourceMap) {
      opts.map = { annotation: false }
    }

    try {
      processors.forEach(processor.use.bind(processor))
      processor
        .process(file.contents, opts)
        .then(handleResult, handleError)
    } catch (error) {
      handleError(error)
    }

    function handleResult (result) {
      var map

      file.contents = new Buffer(result.css)

      // Apply source map to the chain
      if (file.sourceMap) {
        map = result.map.toJSON()
        map.file = file.relative
        map.sources = [].map.call(map.sources, function (source) {
          return path.relative(file.base, source)
        })
        applySourceMap(file, map)
      }

      cb(null, file)
    }

    function handleError (error) {
      cb(new gutil.PluginError('gulp-postcss', error))
    }

  }

  return stream
}
