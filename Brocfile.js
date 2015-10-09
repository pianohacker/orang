var babel = require('broccoli-babel-transpiler');
var browserify = require('broccoli-browserify');
var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var sass = require('broccoli-sass');

var js = './frontend/js';
js = babel(js, {});
js = browserify(js, {
	entries: ['./orang'],
	outputFile: '/gen/bundle.js',
	browserify: {
		paths: ['.'],
	},
});

var fontAwesomeScss = funnel('node_modules/font-awesome/scss', {
	destDir: 'font-awesome'
});
var fontAwesomeFonts = funnel('node_modules/font-awesome/fonts', {
	destDir: 'frontend/fonts'
});

var styles = mergeTrees([
	'frontend/scss',
	fontAwesomeScss
]);	
var styles = sass([styles], 'orang.scss', '/gen/bundle.css');

var fonts = funnel(
	mergeTrees([
		fontAwesomeFonts
	]),
	{
		srcDir: 'frontend',
	}
);

var tree = mergeTrees(['frontend/static', js, styles, fonts]);

module.exports = tree;
