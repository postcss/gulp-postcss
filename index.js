var through = require('through2')
var postcss = require('postcss')
var applySourceMap = require('vinyl-sourcemaps-apply')
var _ = require('lodash')


module.exports = function (processors, options) {

  return through.obj(transform)

  function transform (file, encoding, cb) {

    // Source map is inline by default
    var opts = _.extend({ map: 'inline' }, options)
    var processor = postcss()
    var result

    if (file.base && file.path) {
      opts.from = file.relative
    } else {
      opts.from = file.path
    }

    processors.forEach(processor.use.bind(processor))

    // Generate separate source map for gulp-sourcemap
    if (file.sourceMap) {
      opts.map = true
    }

    result = processor.process(file.contents.toString('utf8'), opts)

    file.contents = new Buffer(result.css)

    // Apply source map to the chain
    if (file.sourceMap) {
      applySourceMap(file, result.map.toString())
    }

    cb(null, file)
  }

}
