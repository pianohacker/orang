import React, { Component } from 'react';

export default class SearchBar extends Component {
	render() {
		return (
			<div id="searchbar">
				<input type="search" onChange={(event) => {this.props.onSearchChanged(event.target.value)}}/>
			</div>
		);
	}
}
