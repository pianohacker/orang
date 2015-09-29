import Item from './item';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';

class _Bin extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<div className="bin">
				{this.props.bin_no}
				<button onClick={() => dispatch(actions.createItem(this.props.loc_id, this.props.bin_no))}>Create Item</button>
				<ul>
					{this.props.items.map((item, i) => { return <Item index={i} loc_id={this.props.loc_id} bin_no={this.props.bin_no} {...item} /> })}
				</ul>
			</div>
		);
	}
}
const Bin = connect()(_Bin);

class _Location extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<div className="location">
				{this.props.name}
				<button onClick={() => dispatch(actions.createBin(this.props.id))}>Create Bin</button>
				<div className="bins">
					{this.props.bins.map((bin, i) => { return <Bin loc_id={this.props.id} bin_no={i} key={i} items={bin} /> })}
				</div>
			</div>
		);
	}
}
const Location = connect()(_Location);

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
