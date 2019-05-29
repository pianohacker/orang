import { saveAs } from 'browser-filesaver/FileSaver';
import _ from 'lodash';
import { denormalize } from 'normalizr';
import u from 'updeep';

import fetch_polyfill from 'fetch-ie8';
const fetch = window.fetch || fetch_polyfill;

import * as schema from './schema';
import { migrate, MIGRATE_VERSION } from './migrate';

function _action( name, ...fields ) {
	let postCreate = ( action ) => action;
	if ( typeof ( fields[ fields.length - 1 ] ) == 'function' ) postCreate = fields.pop();

	return function ( ...values ) {
		return postCreate( u(
			_.zipObject( fields, values ),
			{type: name}
		) );
	};
}

function _modAction( name, ...fields ) {
	let postCreate = ( action ) => action;
	if ( typeof ( fields[ fields.length - 1 ] ) == 'function' ) postCreate = fields.pop();

	return _action( name, ...fields, ( action ) => {
		return postCreate( u( { isModification: true }, action ) );
	} );
};

function _nextId( collection ) {
	return parseInt( _( collection ).keys().max() ) + 1;
}

export const createBin = _modAction( 'createBin', 'loc_id',
	action => ( dispatch, getState ) => {
		dispatch( u( {
			bin_id: _nextId( getState().bin ),
		}, action ) );
	},
);

export const createItem = _modAction(
	'createItem',
	'loc_id',
	'bin_id',
	'size',
	( action ) => ( dispatch, getState ) => {
		dispatch( u( {
			item_id: _nextId( getState().items ),
			name: prompt( 'Name of item:' ),
		}, action ) );
	},
);

export const createItemFitted = _modAction(
	'createItemFitted',
	'loc_id',
	'size',
	( action ) => ( dispatch, getState ) => {
		let state = getState();
		let denormalizedLocation = denormalize(
			state.locations[ action.loc_id ],
			schema.location,
			state,
		);

		// Randomly choose one of the emptiest bins
		let [ emptiest_bin ] = _( denormalizedLocation.bins )
			.map( bin => [ bin.id, _.sumBy( bin.items, ( item ) => parseInt( item.size || 1 ) ) ] )
			.shuffle()
			.minBy( 1 );

		dispatch( u( {
			item_id: _nextId( state.items ),
			name: prompt( 'Name of item:' ),
			bin_id: emptiest_bin,
		}, action ) );
	}
);

export const createLocation = _modAction( 'createLocation', ( action ) => ( dispatch, getState ) => {
	dispatch( u( {
		loc_id: _nextId( getState().locations ),
		name: prompt( 'Name of location:' ),
	}, action ) );
} );

export const deleteItem = _modAction( 'deleteItem', 'bin_id', 'item_id' );

export const exportData = _action( 'exportData', () => ( dispatch, getState ) => {
	saveAs( new Blob( [ JSON.stringify( getState() ) ], {type: 'application/json;charset=utf-8'} ), 'orang.json' );
} );

export const load = _action( 'load', ( action ) => async dispatch => {
	let response = await fetch( '/api/v1/data' );
	let json = await response.json();

	let state = await migrate( json.data, MIGRATE_VERSION );

	return dispatch( u( state, action ) );
} );

export const save = _action( 'save', ( action ) => async ( dispatch, getState ) => {
	dispatch( action );
	let { locations, bins, items } = getState();

	await fetch( '/api/v1/data', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( {
			data: {
				locations, bins, items,
				_persist: { version: MIGRATE_VERSION },
			},
		} ),
	} );
} );

export const setSearch = _action( 'setSearch', 'search' );

export const updateItem = _modAction( 'updateItem', 'loc_id', 'bin_no', 'index', 'changes' );
