import React, { Component } from 'react';

import Header from './header';
import Locations from './locations';

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Header />
				<Locations />
			</div>
		);
	}
}
