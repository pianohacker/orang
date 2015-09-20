import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';

class SearchBar extends Component {
	render() {
		return (
			<div id="searchbar">
				<input type="search" onChange={(event) => {this.props.onSearchChanged(event.target.value)}}/>
			</div>
		);
	}
}

class Header extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<header>
				<SearchBar onSearchChanged={(value) => dispatch(actions.setSearch(value))} />
				<button onClick={() => dispatch(actions.createLocation())}>Add Location</button>
			</header>
		);
	}
}

function select(state) {
	return {};
}

export default connect(select)(Header);
