'use strict';
const postcssLoadConfig = require('postcss-load-config');
const loadOptions = require('postcss-load-options/lib/options.js');
const loadPlugins = require('postcss-load-plugins/lib/plugins.js');

function loadConfig (file, config) {
	const map = file.sourceMap ? { annotation: false } : false;
	function handleResult (config) {
		const options = config.options || {};
		options.map = map;
		config.options = options;
		return config;
	}

	const ctx = {
		file: file,
		from: file.history[0],
		to: file.path,
		cwd: file.cwd,
		map: map,
	};

	if (!config) {
		return postcssLoadConfig(ctx, file.history[0]).then(handleResult);
	}

	if (typeof config === 'function') {
		config = config(ctx);
	}

	let plugins = [];

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
