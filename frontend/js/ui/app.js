import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';

import SearchBar from './search';
import Locations from './locations';

class App extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<div id="app">
				<SearchBar onSearchChanged={(value) => dispatch(actions.setSearch(value))} />
				<Locations locations={this.props.locations}/>
			</div>
		);
	}
}

function selectLocations(locations, search) {
	return u.map(
		u({
			bins: u.map(u.reject((item) => !item.name.match(search)))
		}),
		locations
	);
}

function select(state) {
	return {
		locations: selectLocations(state.locations, state.search)
	};
}

export default connect(select)(App);
