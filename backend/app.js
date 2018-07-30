import bodyParser from 'body-parser';
import express from 'express';
import sqlite3 from 'sqlite3';

var app = express();

if ('development' == app.get('env')) {
	const webpack = require('webpack');
	const webpackConfig = require('../webpack.config.js');
	const devMiddleware = require('webpack-dev-middleware');

	app.use(devMiddleware(
		webpack(webpackConfig),
		{
			publicPath: '/',
		}
	));
}

app.use(bodyParser.json());

var db = new sqlite3.Database('data.db');

db.serialize(() => {
	db.run('CREATE TABLE IF NOT EXISTS user_data (user TEXT PRIMARY KEY, data TEXT);');
});

app.get('/api/v1/data', (req, res) => {
	db.get('SELECT data FROM user_data', (err, row) => {
		res.json({data: row ? JSON.parse(row.data) : null});
	});
});

app.post('/api/v1/data', (req, res) => {
	console.log(req.body);

	db.run('INSERT OR REPLACE INTO user_data(user, data) VALUES("", ?)', JSON.stringify(req.body.data), () => {
		res.status(200);
		res.end();
	});
});

app.listen(4200);
