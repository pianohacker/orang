import Item from './item';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';

class _Bin extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<div className={"bin" + (this.props.items.length == 0 ? " empty" : "")}>
				<header>
					<h1>{this.props.bin_no}</h1>
					<button title="Add item" onClick={() => dispatch(actions.createItem(this.props.loc_id, this.props.bin_no))}><i className="fa fa-plus"></i></button>
				</header>
				<ul className="items">
					{this.props.items.map((item, i) => { return <Item index={i} loc_id={this.props.loc_id} bin_no={this.props.bin_no} {...item} /> })}
				</ul>
			</div>
		);
	}
}
const Bin = connect()(_Bin);

var sizeNames = {1: 'S', 4: 'M', 9: 'L', 16: 'X'};
class _Location extends Component {
	render() {
		const { dispatch } = this.props;

		//<button title="Add bin" onClick={() => dispatch(actions.createBin(this.props.id))}>+</button>
		return (
			<div className="location">
				<header>
					<h1>{this.props.name}</h1>
					<div className="item-creators">
						<i className="fa fa-plus"></i>
						{[1, 4, 9, 16].map((size) => <button>{sizeNames[size]}</button>)}
					</div>
				</header>
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
	// Only match case-insensitively if no uppercase letters in search
	var searcher = new RegExp(state.filters.search, state.filters.search.match(/[A-Z]/) ? undefined : 'i');

	return {
		locations: u.map(
			u({

				bins: u.map(u.reject((item) => !item.name.match(searcher)))
			}),
			state.locations
		)
	};
}

export default connect(select)(Locations);
