'use strict';
const PluginError = require('gulp-util').PluginError;
const postcss = require('postcss');
const applySourceMap = require('./applySourceMap');
const loadConfig = require('./loadConfig');

function process(buffer, file, config) {
	function handleResult (result) {
		file.postcss = result;
		applySourceMap(file, result);
		return new Buffer(result.content);
	}

	function handleError (error) {
		var errorOptions = { fileName: file.path, showStack: true, error: error };
		if (error.name === 'CssSyntaxError') {
			errorOptions.fileName = error.file || file.path;
			errorOptions.lineNumber = error.line;
			errorOptions.showProperties = false;
			errorOptions.showStack = false;
			error = error.message + '\n\n' + error.showSourceCode() + '\n';
		}
		// Prevent stream’s unhandled exception from
		// being suppressed by Promise
		throw new PluginError('gulp-postcss', error, errorOptions);
	}
	return loadConfig(file, config).then(function (config) {
		return postcss(config.plugins).process(buffer, config.options);
	}).then(handleResult, handleError);
}

module.exports = process;
