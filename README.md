# gulp-html-postcss

[![NPM version](https://img.shields.io/npm/v/gulp-html-postcss.svg?style=flat-square)](https://www.npmjs.com/package/gulp-html-postcss)
[![Build Status](https://img.shields.io/travis/StartPolymer/gulp-html-postcss.png)](https://travis-ci.org/StartPolymer/gulp-html-postcss)
[![Coverage Status](https://img.shields.io/coveralls/StartPolymer/gulp-html-postcss.png)](https://coveralls.io/r/StartPolymer/gulp-html-postcss)

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
const postcss = require('gulp-postcss');
const gulp = require('gulp');

gulp.task('css', () => (
    gulp.src('./src/*.html')
        .pipe(postcss())
        .pipe(gulp.dest('./dest'))
));
```

## Advanced usage

You can pass config as an {Object}
as [described here](https://www.npmjs.com/package/postcss-load-config#postcssrc),

If you want to configure postcss on per-file-basis, you can pass a callback
that receives `ctx` with the context options and the [vinyl file](https://github.com/gulpjs/vinyl).
[Described here](https://www.npmjs.com/package/postcss-load-config#postcssconfigjs-or-postcssrcjs),

```js
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const reporter = require('gulp-reporter');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sugarss = require('sugarss');

gulp.task('css', () => {
    const callback = (ctx) => ({
        // Configure parser on per-file-basis.
        parser: ctx.file.extname === '.sss' ? 'sugarss' : false,
        // Plugins can be loaded in either using an {Object} or an {Array}.
        plugins: [
            autoprefixer,
            cssnano
        ]
    });

    return gulp.src('./src/*.html', {
        // Source map support
        sourcemaps: true
    })
        .pipe(postcss(callback))
        // Message repport support
        .pipe(reporter())
        .pipe(gulp.dest('./dest'));
});
```
