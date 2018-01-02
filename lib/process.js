'use strict';
const PluginError = require('plugin-error');
const postcss = require('postcss');
const applySourceMap = require('./applySourceMap');
const loadConfig = require('./loadConfig');
const autoSyntax = require('postcss-html');

function process (buffer, file, config) {
	function handleResult (result) {
		file.postcss = result;
		applySourceMap(file, result);
		return Buffer.from(result.content);
	}

	function handleError (error) {
		const errorOptions = { fileName: file.path, showStack: true, error: error };
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
		const syntax = autoSyntax(config.options.syntax);
		const document = syntax.parse(buffer, Object.assign({}, config.options));
		if (document.source.syntax) {
			return postcss(
				config.plugins
			).process(
				document,
				Object.assign(
					{
						syntax: document.source.syntax,
					},
					config.options
				)
			);
		} else if (document.nodes.length) {
			return Promise.all(
				document.nodes.map(function (root) {
					return postcss(
						config.plugins
					).process(
						root,
						config.options
					);
				})
			).then(function (results) {
				const messages = results.reduce(function (messages, result) {
					return messages.concat(result.messages);
				}, []);
				const lastResult = results.pop();
				return Object.assign(
					new lastResult.constructor(lastResult.processor, document, lastResult.opts),
					{
						lastPlugin: lastResult.lastPlugin,
						css: document.toString(syntax),
						messages: messages,
					}
				);
			});
		} else {
			return document.toResult(
				Object.assign(
					{},
					config.options,
					{
						syntax: syntax,
					}
				)
			);
		}
	}).then(handleResult, handleError);
}

module.exports = process;
