import React, { Component } from 'react';
import SearchBar from './search';
import Locations from './locations';

export default class App extends Component {
	onSearchChanged(value) {
		console.log(value);
	}

	render() {
		return (
			<div id="app">
				<SearchBar onSearchChanged={this.onSearchChanged} />
				<Locations locations={[
					{
						id: 1,
						name: 'Hex',
						bins: [
							[],
							[],
							[
								{ name: 'Measuring Tape' },
							],
							[],
						],
					},
					{
						id: 2,
						name: 'Cables',
						bins: [
							[
								{ name: 'Micro USB Cables' },
							],
							[],
							[
								{ name: 'HDMI Cables' },
							],
							[],
						],
					}
				]}/>
			</div>
		);
	}
}
