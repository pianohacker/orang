const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

module.exports = {
	entry: [
		'./frontend/js/orang.js',
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				use: [
					'babel-loader',
				],
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/,
				use: [
					{loader: 'style-loader'},
					{loader: 'css-loader'},
					{
						loader: 'sass-loader',
						options: { implementation: require( 'sass' ) },
					},
				],
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff',
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader',
			},
		],
	},

	devtool: 'source-map',
	devServer: {
		contentBase: path.join( __dirname, 'frontend', 'static' ),
		port: 4200,
	},

	output: {
		path: path.resolve( __dirname, 'build' ),
		filename: 'bundle.js',
	},
	plugins: [
		new CopyWebpackPlugin( [
			{ from: 'frontend/static/', to: '' },
		] ),
	],
};
