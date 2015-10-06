import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';

class SearchBar extends Component {
	render() {
		return (
			<input id="searchbar" type="search" onChange={(event) => {this.props.onSearchChanged(event.target.value)}}/>
		);
	}
}

class Header extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<header>
				<h1>orang</h1>
				<SearchBar onSearchChanged={(value) => dispatch(actions.setSearch(value))} />
				<button onClick={() => dispatch(actions.createLocation())}>Add Location</button>
				<button onClick={() => dispatch(actions.exportData())}>Export Data</button>
			</header>
		);
	}
}

function select(state) {
	return {};
}

export default connect(select)(Header);
