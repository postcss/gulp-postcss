'use strict';
var applySourceMap = require('vinyl-sourcemaps-apply');
var path = require('path');

module.exports = function(file, result) {
    // Apply source map to the chain
	if (file.sourceMap) {
		var map;
		map = result.map.toJSON();
		map.file = file.relative;
		map.sources = [].map.call(map.sources, function (source) {
			return path.join(path.dirname(file.relative), source);
		});
		applySourceMap(file, map);
	}
};