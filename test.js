/* global it */

var assert = require('assert')
var gutil = require('gulp-util')
var postcss = require('.')

it('should transform css with multiple processors', function (cb) {

  var stream = postcss(
    [ doubler, doubler ]
  , { map: false }  // omit source map for the test
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
    contents: new Buffer('a {\n  a b {}\n}')
  }))

  stream.end()

})


it ('should throw error if processors are not provided', function (cb) {
  assert.throws( function () { postcss() }, gutil.PluginError )
  assert.throws( function () { postcss('') }, gutil.PluginError )
  assert.throws( function () { postcss({}) }, gutil.PluginError )
  cb()
})


function doubler (css) {
  css.eachDecl(function (decl) {
    decl.parent.prepend(decl.clone())
  })
}
