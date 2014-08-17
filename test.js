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


function doubler (css) {
  css.eachDecl(function (decl) {
    decl.parent.prepend(decl.clone())
  })
}
