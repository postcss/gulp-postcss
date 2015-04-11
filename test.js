/* global it, beforeEach, afterEach, describe, Promise */

var assert = require('assert')
var gutil = require('gulp-util')
var sourceMaps = require('gulp-sourcemaps')
var postcss = require('./index')
var proxyquire = require('proxyquire')
var sinon = require('sinon')

it('should transform css with multiple processors', function (cb) {

  var stream = postcss(
    [ asyncDoubler, objectDoubler() ]
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


it('should throw error if processors are not provided', function (cb) {
  assert.throws( function () { postcss() }, gutil.PluginError )
  assert.throws( function () { postcss('') }, gutil.PluginError )
  assert.throws( function () { postcss({}) }, gutil.PluginError )
  cb()
})


it('should generate source maps', function (cb) {

  var init = sourceMaps.init()
  var write = sourceMaps.write()
  var css = postcss(
    [ doubler, asyncDoubler ]
  )

  init
    .pipe(css)
    .pipe(write)

  write.on('data', function (file) {
    assert.equal(file.sourceMap.mappings, 'AAAA,IAAI,aAAY,CAAZ,aAAY,CAAZ,aAAY,CAAZ,YAAY,EAAE')
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


it('should correctly generate relative source map', function (cb) {

  var init = sourceMaps.init()
  var css = postcss(
    [ doubler, doubler ]
  )

  init.pipe(css)

  css.on('data', function (file) {
    assert.equal(file.sourceMap.file, 'fixture.css')
    assert.deepEqual(file.sourceMap.sources, ['fixture.css'])
    cb()
  })

  init.write(new gutil.File({
    base: __dirname + '/src',
    path: __dirname + '/src/fixture.css',
    contents: new Buffer('a { color: black }')
  }))

  init.end()

})


describe('PostCSS Guidelines', function () {

  var sandbox = sinon.sandbox.create()
  var postcssStub = {
    use: sandbox.stub()
  , process: sandbox.stub()
  }
  var postcss = proxyquire('./index', {
    postcss: function () {
      return postcssStub
    }
  })


  afterEach(function () {
    sandbox.restore()
  })


  it('should set `from` and `to` processing options to `file.path`', function (cb) {

    var stream = postcss([ doubler ])
    var cssPath = __dirname + '/src/fixture.css'
    postcssStub.process.returns(Promise.resolve({css:''}))

    stream.on('data', function () {
      postcssStub.process.calledWith('a {}', {from: cssPath, to: cssPath})
      cb()
    })

    stream.write(new gutil.File({
      contents: new Buffer('a {}')
    , path: cssPath
    }))

    stream.end()

  })

})


function doubler (css) {
  css.eachDecl(function (decl) {
    decl.parent.prepend(decl.clone())
  })
}

function asyncDoubler (css) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      doubler(css)
      resolve()
    })
  })
}

function objectDoubler () {
  var processor = require('postcss')()
  processor.use(doubler)
  return processor
}
