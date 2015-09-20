import Item from './item';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';

class Bin extends Component {
	render() {
		return (
			<div className="bin">
				<ul>
					{this.props.items.map((item) => { return <Item {...item} /> })}
				</ul>
			</div>
		);
	}
}

class Location extends Component {
	render() {
		return (
			<div className="location">
				{this.props.name}
				{this.props.bins.map((bin, i) => { return <Bin key={i} items={bin} /> })}
			</div>
		);
	}
}

export default class Locations extends Component {
	render() {
		return (
			<div id="locations">
				{this.props.locations.map((loc) => { return <Location key={loc.id} {...loc} /> })}
			</div>
		);
	}
}

function select(state) {
	return {
		locations: u.map(
			u({
				bins: u.map(u.reject((item) => !item.name.match(state.search)))
			}),
			state.locations
		)
	};
}

export default connect(select)(Locations);
