# gulp-html-postcss

[PostCSS](https://github.com/postcss/postcss) gulp plugin to pipe inline CSS in HTML within the `<style>` tags through several processors, but parse CSS only once.

## Install

`npm install --save-dev gulp-html-postcss`

Install required [postcss plugins](https://www.npmjs.com/browse/keyword/postcss-plugin) separately. E.g. for autoprefixer, you need to install [autoprefixer](https://github.com/postcss/autoprefixer) package.

## Basic usage

```js
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');

gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        mqpacker,
        csswring
    ];
    return gulp.src('./src/*.html')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
```

## Using a custom processor

```js
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var opacity = function (css, opts) {
    css.eachDecl(function(decl) {
        if (decl.prop === 'opacity') {
            decl.parent.insertAfter(decl, {
                prop: '-ms-filter',
                value: '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (parseFloat(decl.value) * 100) + ')"'
            });
        }
    });
};

gulp.task('css', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        opacity,
        cssnext()
    ];
    return gulp.src('./src/*.html')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dest'));
});
```

## Source map support

Source map is disabled by default, to extract map use together
with [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps).

```js
return gulp.src('./src/*.html')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dest'));
```
