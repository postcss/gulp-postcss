'use strict';
var syntax = require('postcss-html');
var postcssLoadConfig = require('postcss-load-config');
var loadOptions = require('postcss-load-options/lib/options.js');
var loadPlugins = require('postcss-load-plugins/lib/plugins.js');

function loadConfig(file, config) {
	var map = file.sourceMap ? { annotation: false } : false;
	function handleResult(config) {
		var options = config.options || {};
		if (!(options.syntax || options.stringifier || options.parser)) {
			options.syntax = syntax;
		}
		options.map = map;
		config.options = options;
		return config;
	}

	var ctx = {
		file: file,
		from: file.history[0],
		to: file.path,
		cwd: file.cwd,
		syntax: syntax,
		map: map,
	};

	if (!config) {
		return postcssLoadConfig(ctx, file.history[0]).then(handleResult);
	}

	if (typeof config === 'function') {
		config = config(ctx);
	}

	var plugins = [];

	if (Array.isArray(config)) {
		plugins = config;
		config = ctx;
	} else {
		config = Object.assign(ctx, config);
		if (config.plugins) {
			plugins = loadPlugins(config);
		}
	}

	config = handleResult({
		plugins: plugins,
		options: loadOptions(config),
	});
	return Promise.resolve(config);
}

module.exports = loadConfig;