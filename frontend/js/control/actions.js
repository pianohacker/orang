import { saveAs } from 'browser-filesaver/FileSaver';
import _ from 'lodash';
import u from 'updeep';

import fetch_polyfill from 'fetch-ie8';
const fetch = window.fetch || fetch_polyfill;

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
		return postCreate( u( {isModification: true}, action ) );
	} );
};

export const createBin = _modAction( 'createBin', 'loc_id' );
export const createItem = _modAction( 'createItem', 'loc_id', 'bin_no', 'size', ( action ) => ( dispatch, getState ) => {
	dispatch( u( {name: prompt( 'Name of item:' )}, action ) );
} );
export const createItemFitted = _modAction( 'createItemFitted', 'loc_id', 'size', ( action ) => ( dispatch, getState ) => {
	dispatch( u( {name: prompt( 'Name of item:' )}, action ) );
} );
export const createLocation = _modAction( 'createLocation', ( action ) => ( dispatch, getState ) => {
	dispatch( u( {name: prompt( 'Name of location:' )}, action ) );
} );
export const deleteItem = _modAction( 'deleteItem', 'loc_id', 'bin_no', 'index' );
export const exportData = _action( 'exportData', ( action ) => ( dispatch, getState ) => {
	saveAs( new Blob( [ JSON.stringify( getState() ) ], {type: 'application/json;charset=utf-8'} ), 'orang.json' );
} );

export const load = _action( 'load', ( action ) => async dispatch => {
	let response = await fetch( '/api/v1/data' );
	let json = await response.json();

	let { locations } = await migrate( json.data, MIGRATE_VERSION );

	return dispatch( u( { locations }, action ) );
} );

export const save = _action( 'save', ( action ) => ( dispatch, getState ) => {
	dispatch( action );
	let state = getState();

	fetch( '/api/v1/data', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( {data: state.locations} ),
	} ).then(
		() => {
			return;
		},
		() => {
			alert( 'save failed' );
		}
	);
} );
export const setSearch = _action( 'setSearch', 'search' );
export const updateItem = _modAction( 'updateItem', 'loc_id', 'bin_no', 'index', 'changes' );
