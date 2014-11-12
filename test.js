/* global it */

var assert = require('assert')
var gutil = require('gulp-util')
var sourceMaps = require('gulp-sourcemaps')
var postcss = require('./index')

it('should transform css with multiple processors', function (cb) {

  var stream = postcss(
    [ doubler, doubler ]
  )

  stream.on('data', function (file) {
    var result = file.contents.toString('utf8')
    var target = 'a { color: black; color: black; color: black; color: black }'
    assert.equal( result, target )
    cb()
  })

  stream.write(new gutil.File({
    contents: new Buffer('a { color: black }')
  }))

  stream.end()

})


it('should correctly wrap postcss errors', function (cb) {

  var stream = postcss([ doubler ])

  stream.on('error', function (err) {
    assert.ok(err instanceof gutil.PluginError)
    assert.equal(err.plugin, 'gulp-postcss')
    cb()
  })

  stream.write(new gutil.File({
    contents: new Buffer('a {')
  }))

  stream.end()

})


it ('should throw error if processors are not provided', function (cb) {
  assert.throws( function () { postcss() }, gutil.PluginError )
  assert.throws( function () { postcss('') }, gutil.PluginError )
  assert.throws( function () { postcss({}) }, gutil.PluginError )
  cb()
})


it ('should generate source maps', function (cb) {

  var init = sourceMaps.init()
  var write = sourceMaps.write()
  var css = postcss(
    [ doubler, doubler ]
  )

  init
    .pipe(css)
    .pipe(write)

  write.on('data', function (file) {
    assert.equal(file.sourceMap.mappings, 'AAAA,IAAI,cAAA,AAAY,cAAZ,AAAY,cAAZ,AAAY,aAAA,EAAE')
    assert(/sourceMappingURL=data:application\/json;base64/.test(file.contents.toString()))
    cb()
  })

  init.write(new gutil.File({
    base: __dirname,
    path: __dirname + '/fixture.css',
    contents: new Buffer('a { color: black }')
  }))

  init.end()

})


function doubler (css) {
  css.eachDecl(function (decl) {
    decl.parent.prepend(decl.clone())
  })
}
