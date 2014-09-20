var through = require('through2')
var postcss = require('postcss')
var applySourceMap = require('vinyl-sourcemaps-apply')
var gutil = require('gulp-util')


module.exports = function (processors, options) {

  if (!Array.isArray(processors)) {
    throw new gutil.PluginError('gulp-postcss', 'Please provide array of postcss processors!')
  }

  return through.obj(transform)

  function transform (file, encoding, cb) {

    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-postcss', 'Streams are not supported!'))
    }

    // Source map is disabled by default
    var opts = { map: false }
    var processor = postcss()
    var result
    var attr

    // Extend default options
    if (options) {
      for (attr in options) {
        if (options.hasOwnProperty(attr)) {
          opts[attr] = options[attr]
        }
      }
    }

    if (file.base && file.path) {
      opts.from = file.relative
    } else {
      opts.from = file.path
    }

    // Generate separate source map for gulp-sourcemap
    if (file.sourceMap) {
      opts.map = { annotation: false }
    }

    try {
      processors.forEach(processor.use.bind(processor))
      result = processor.process(file.contents.toString('utf8'), opts)
    } catch (err) {
      return cb(new gutil.PluginError('gulp-postcss', err))
    }

    file.contents = new Buffer(result.css)

    // Apply source map to the chain
    if (file.sourceMap) {
      applySourceMap(file, result.map.toString())
    }

    cb(null, file)
  }

}
