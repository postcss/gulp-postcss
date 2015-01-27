var through = require('through2')
var postcss = require('postcss')
var applySourceMap = require('vinyl-sourcemaps-apply')
var gutil = require('gulp-util')
var path = require('path')

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
    var map

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
      result = processor.process(file.contents.toString('utf8'), opts)
    } catch (err) {
      return cb(new gutil.PluginError('gulp-postcss', err))
    }

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

}
