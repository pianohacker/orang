import { denormalize, normalize } from 'normalizr';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import u from 'updeep';

import * as actions from '../control/actions';
import * as schema from '../control/schema';
import * as common from './common';
import Item from './item';

class _Bin extends Component {
	render() {
		const { dispatch } = this.props;

		let sortedItems = [].concat( this.props.items || [] );
		sortedItems.sort((a, b) => a.name.localeCompare(b.name))

		return (
			<div className={'bin' + ( sortedItems.length == 0 ? ' empty' : '' )}>
				<header>
					<h1>{this.props.bin_no + 1}</h1>
					<button title="Add item" onClick={() => dispatch( actions.createItem( this.props.loc_id, this.props.id, 1 ) )}><i className="fa fa-plus"></i></button>
				</header>
				<ul className="items">
					{sortedItems.map( item => <Item bin_id={this.props.id} key={item.id} {...item} /> )}
				</ul>
			</div>
		);
	}
}
const Bin = connect(
	( state, { id } ) => denormalize( state.bins[id], schema.bin, state ) || {}
)( _Bin );

class _Location extends Component {
	render() {
		const { dispatch } = this.props;

		return (
			<div className="location">
				<header>
					<h1>{this.props.name}</h1>
					<div className="location-tools">
						<div>
							<button onClick={() => dispatch( actions.createBin( this.props.id ) )}>Add Bin</button>
						</div>
						<div className="item-creators">
							<i className="fa fa-plus"></i>
							{[ 1, 4, 9, 16 ].map(
								( size ) => <button onClick={() => dispatch( actions.createItemFitted( this.props.id, size ) )} key={size}>
									{common.SIZE_NAMES[ size ]}
								</button>
							)}
						</div>
					</div>
				</header>
				<div className="bins">
					{
						(this.props.bins || []).map( ( bin_id, bin_no ) => <Bin key={bin_id} id={bin_id} bin_no={bin_no} />)
					}
				</div>
			</div>
		);
	}
}

const Location = connect( ( { locations }, { id } ) => locations[id] )( _Location );

class Locations extends Component {
	render() {
		return (
			<div id="locations">
				{ this.props.locations.map( loc_id => <Location key={loc_id} id={loc_id} /> ) }
			</div>
		);
	}
}

function select( state ) {
	// Only match case-insensitively if no uppercase letters in search
	let searcher = new RegExp( state.filters.search, state.filters.search.match( /[A-Z]/ ) ? undefined : 'i' );

	return {
		locations: u.map(
			u( {

				bins: u.map( u.reject( ( item ) => !( item.name || '' ).match( searcher ) ) ),
			} ),
			state.locations
		),
	};
}

export default connect( ( { locations } ) => ( { locations: Object.keys( locations ) } ) )( Locations );
