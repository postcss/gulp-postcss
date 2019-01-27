## Changelog

* 8.1.0
  * Removed deprecated usages of `new Buffer()`
  * Accepts a new third `pluginOptions` parameter with `handleResult`, which
    allows us to handle the results from PostCSS. (For example: handling messages
    from PostCSS plugins.)
  * Declared the supported node version in package.json

* 8.0.0
  * Bump PostCSS to 7.0
  * Drop Node 4 support

* 7.0.1
  * Drop dependency on gulp-util

* 7.0.0
  * Bump PostCSS to 6.0
  * Smaller module size
  * Use eslint instead of jshint

* 6.4.0
  * Add more details to `PluginError` object

* 6.3.0
  * Integrated with postcss-load-config
  * Added a callback to configure postcss on per-file-basis
  * Dropped node 0.10 support

* 6.2.0
  * Fix syntax error message for PostCSS 5.2 compatibility

* 6.1.1
  * Fixed the error output

* 6.1.0
  * Support for `null` files
  * Updated dependencies

* 6.0.1
  * Added an example and a test to pass options to PostCSS (e.g. `syntax` option)
  * Updated vinyl-sourcemaps-apply to 0.2.0

* 6.0.0
  * Updated PostCSS to version 5.0.0

* 5.1.10
  * Use autoprefixer in README

* 5.1.9
  * Prevent unhandled exception of the following pipes from being suppressed by Promise

* 5.1.8
  * Prevent stream’s unhandled exception from being suppressed by Promise

* 5.1.7
  * Updated direct dependencies

* 5.1.6
  * Updated `CssSyntaxError` check

* 5.1.4
  * Simplified error handling
  * Simplified postcss execution with object plugins

* 5.1.3 Updated travis banner

* 5.1.2 Transferred repo into postcss org on github

* 5.1.1
  * Allow override of `to` option

* 5.1.0 PostCSS Runner Guidelines
  * Set `from` and `to` processing options
  * Don't output js stack trace for `CssSyntaxError`
  * Display `result.warnings()` content

* 5.0.1
  * Fix to support object plugins

* 5.0.0
  * Use async API

* 4.0.3
  * Fixed bug with relative source map

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
  * Don't add source map comment if used with gulp-sourcemaps

* 1.0.0
  * Initial release
