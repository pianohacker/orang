import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchBar from './search';
import Locations from './locations';

class App extends Component {
	onSearchChanged(value) {
		console.log(value);
	}

	render() {
		return (
			<div id="app">
				<SearchBar onSearchChanged={this.onSearchChanged} />
				<Locations locations={this.props.locations}/>
			</div>
		);
	}
}

function select(state) {
	return state;
}

export default connect(select)(App);
