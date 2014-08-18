gulp-postcss
============

[PostCSS](https://github.com/postcss/postcss) gulp plugin

## Basic usage

```
var postcss = require('gulp-postcss')
var gulp = require('gulp')
var autoprefixer = require('autoprefixer')
var mqpacker = require('css-mqpacker')
var csswring = require('csswring')

gulp.task('css', function () {
  var processors = [
    autoprefixer('last 1 version').postcss
  , mqpacker.processor
  , csswring.postcss
  ]
  return gulp.src('./src/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dest'))
})
```

## Source map support

Source map is inlined by default, to extract map use together
with [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps).

```
return gulp.src('./src/*.css')
  .pipe(sourcemaps.init())
  .pipe(postcss(processors))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dest'))
```
