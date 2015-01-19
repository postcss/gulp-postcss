# gulp-postcss [![Build Status](https://api.travis-ci.org/w0rm/gulp-postcss.png)](https://travis-ci.org/w0rm/gulp-postcss)

[PostCSS](https://github.com/postcss/postcss) gulp plugin to pipe CSS through
several processors, but parse CSS only once.

## Install

    $ npm install --save-dev gulp-postcss

## Basic usage

```js
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer-core');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');

gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        mqpacker,
        csswring
    ];
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
```

## Using a custom processor

```js
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var opacity = function (css, opts) {
    css.eachDecl(function(decl) {
        if (decl.prop === 'opacity') {
            decl.parent.insertAfter(decl, {
                prop: '-ms-filter',
                value: '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (parseFloat(decl.value) * 100) + ')"'
            });
        }
    }
};

gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        opacity
    ];
    return gulp.src('./src/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
```

## Source map support

Source map is disabled by default, to extract map use together
with [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps).

```js
return gulp.src('./src/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dest'));
```

## Changelog

* 4.0.2
  * Made PostCSS a simple dependency, because peer dependency is deprecated

* 4.0.1
  * Made PostCSS 4.x a peer dependency

* 4.0.0
  * Updated PostCSS to 4.0

* 3.0.0
  * Updated PostCSS to 3.0 and fixed tests

* 2.0.1
  * Added Changelog
  * Added example for a custom processor in README

* 2.0.0
  * Disable source map by default
  * Test source map
  * Added Travis support
  * Use autoprefixer-core in README

* 1.0.2
  * Improved README

* 1.0.1
  * Don't add source map comment if used with gulp-sourcemap

* 1.0.0
  * Initial release
