import Item from './item';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';
import * as common from './common';

class _Bin extends Component {
	render() {
		const { dispatch } = this.props;

		var sortedItems = [].concat(this.props.items);
		//sortedItems.sort((a, b) => a.name.localeCompare(b.name))

		return (
			<div className={"bin" + (this.props.items.length == 0 ? " empty" : "")}>
				<header>
					<h1>{this.props.bin_no + 1}</h1>
					<button title="Add item" onClick={() => dispatch(actions.createItem(this.props.loc_id, this.props.bin_no, 1))}><i className="fa fa-plus"></i></button>
				</header>
				<ul className="items">
					{sortedItems.map((item, i) => <Item index={i} loc_id={this.props.loc_id} bin_no={this.props.bin_no} {...item} />)}
				</ul>
			</div>
		);
	}
}
const Bin = connect()(_Bin);

class _Location extends Component {
	render() {
		const { dispatch } = this.props;

		//<button title="Add bin" onClick={() => dispatch(actions.createBin(this.props.id))}>+</button>
		return (
			<div className="location">
				<header>
					<h1>{this.props.name}</h1>
					<div className="location-tools">
						<div>
							<button onClick={() => dispatch(actions.createBin(this.props.id))}>Add Bin</button>
						</div>
						<div className="item-creators">
							<i className="fa fa-plus"></i>
							{[1, 4, 9, 16].map(
								(size) => <button onClick={() => dispatch(actions.createItemFitted(this.props.id, size))}>
									{common.SIZE_NAMES[size]}
								</button>
							)}
						</div>
					</div>
				</header>
				<div className="bins">
					{this.props.bins.map((bin, i) => <Bin loc_id={this.props.id} bin_no={i} key={i} items={bin} />)}
				</div>
			</div>
		);
	}
}
const Location = connect()(_Location);

class Locations extends Component {
	render() {
		return (
			<div id="locations">
				{this.props.locations.map((loc) => <Location key={loc.id} {...loc} />)}
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

				bins: u.map(u.reject((item) => !(item.name || '').match(searcher)))
			}),
			state.locations
		)
	};
}

export default connect(select)(Locations);
