'use strict';
const applySourceMap = require('vinyl-sourcemaps-apply');
const path = require('path');

module.exports = function(file, result) {
    // Apply source map to the chain
	if (file.sourceMap) {
		const map = result.map.toJSON();
		map.file = file.relative;
		map.sources = [].map.call(map.sources, function (source) {
			return path.join(path.dirname(file.relative), source);
		});
		applySourceMap(file, map);
	}
};