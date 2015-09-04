var babel = require('broccoli-babel-transpiler');
var browserify = require('broccoli-browserify');
var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var sass = require('broccoli-sass');

var js = './frontend/js';
js = babel(js, {
	modules: 'amd',
	sourceMap: 'inline',
});
js = browserify(js, {
	entries: ['./orang.js'],
	outputFile: '/gen/bundle.js',
});
////var styles = sass(['scss'], 'encal.scss', 'assets/encal.css');

var tree = mergeTrees(['frontend/static', js]);

module.exports = tree;
