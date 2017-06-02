# gulp-html-postcss

[PostCSS](https://github.com/postcss/postcss) gulp plugin to pipe inline CSS in HTML within the `<style>` tags through
several plugins, but parse CSS only once.

## Install

    $ npm install --save-dev gulp-html-postcss

Install required [postcss plugins](https://www.npmjs.com/browse/keyword/postcss-plugin) separately. E.g. for autoprefixer, you need to install [autoprefixer](https://github.com/postcss/autoprefixer) package.

## Basic usage

The configuration is loaded automatically from `postcss.config.js`
as [described here](https://www.npmjs.com/package/postcss-load-config),
so you don't have to specify any options.

```js
var postcss = require('gulp-postcss');
var gulp = require('gulp');

gulp.task('css', function () {
    return gulp.src('./src/*.css')
        .pipe(postcss())
        .pipe(gulp.dest('./dest'));
});
```

## Passing plugins directly

```js
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('css', function () {
    var plugins = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano()
    ];
    return gulp.src(['./src/*.html', './src/*.vue', './src/*.css'])
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dest'));
});
```

## Passing additional options to PostCSS

The second optional argument to gulp-postcss is passed to PostCSS.

This, for instance, may be used to enable custom parser:

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var nested = require('postcss-nested');
var sugarss = require('sugarss');

gulp.task('default', function () {
    var plugins = [nested];
    return gulp.src('in.sss')
        .pipe(postcss(plugins, { parser: sugarss }))
        .pipe(gulp.dest('out'));
});
```

## Using a custom processor

```js
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
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
    var plugins = [
        cssnext({browsers: ['last 1 version']}),
        opacity
    ];
    return gulp.src(['./src/*.html', './src/*.vue', './src/*.css'])
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dest'));
});
```

## Source map support

Source map is disabled by default, to extract map use together
with [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps).

```js
return gulp.src(['./src/*.html', './src/*.vue', './src/*.css'])
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dest'));
```
