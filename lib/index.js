'use strict';
const Transform = require('stream').Transform;
const BufferStreams = require('bufferstreams');
const process = require('./process');

module.exports = function (config) {
	function transform (file, encoding, done) {
		if (file.isBuffer()) {
			process(file.contents, file, config).then(function (contents) {
				file.contents = contents;
				done(null, file);
			}, done);
		} else if (file.isStream()) {
			file.contents = file.contents.pipe(new BufferStreams(function (err, buf, cb) {
				/* istanbul ignore else */
				if (buf) {
					process(buf, file, config).then(function (contents) {
						done(null, file);
						cb(null, contents);
					}, done);
				} else {
					done(err, file);
					cb(err, buf);
				}
			}));
		} else {
			done(null, file);
		}
	}

	return new Transform({
		objectMode: true,
		transform,
	});
};
