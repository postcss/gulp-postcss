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

## Advanced usage

You can pass config as an {Object}
as [described here](https://www.npmjs.com/package/postcss-load-config#postcssrc),

If you want to configure postcss on per-file-basis, you can pass a callback
that receives `ctx` with the context options and the [vinyl file](https://github.com/gulpjs/vinyl).
[Described here](https://www.npmjs.com/package/postcss-load-config#postcssconfigjs-or-postcssrcjs),

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var reporter = require('gulp-reporter');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var sugarss = require('sugarss');

gulp.task('css', function () {
    function callback(ctx) {
        return {
            // Configure parser on per-file-basis.
            parser: ctx.file.extname === '.sss' ? 'sugarss' : false,
            // Plugins can be loaded in either using an {Object} or an {Array}.
            plugins: [
                autoprefixer,
                cssnano
            ]
        };
    }
    return gulp.src('./src/*.css', {
        // Source map support
        sourcemaps: true
    })
        .pipe(postcss(callback))
        // Message repport support
        .pipe(reporter())
        .pipe(gulp.dest('./dest'));
});
```
