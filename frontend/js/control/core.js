import immer from 'immer';
import _ from 'lodash';
import * as redux from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import u from 'updeep';

import { migrate, MIGRATE_VERSION } from './migrate';

const DEFAULT_FILTERS = {
	search: '',
};

function _arrayAdd( val ) {
	return ( arr ) => [].concat( arr, [ val ] );
}

function filtersReducer( filters = DEFAULT_FILTERS, action ) {
	switch ( action.type ) {
		case 'setSearch':
			return u( { search: action.search }, filters );

		default: return filters;
	}
}

function isModifiedReducer( isModified = false, action ) {
	if ( action.type == 'save' ) return false;

	return action.isModification ? true : isModified;
}

function locationsReducer( locations = {}, action ) {
	return immer( locations, draft => {
		let location = draft[ action.loc_id ];

		switch ( action.type ) {
			case 'createLocation':
				draft[ action.loc_id ] = {
					id: action.loc_id,
					name: action.name,
					bins: [],
				};
				break;

			case 'createBin':
				location.bins.push( action.bin_id );
				break;

			case 'load':
				return action.locations;

			default: return locations;
		}
	} );
}

function binsReducer( bins = {}, action ) {
	return immer( bins, draft => {
		let bin = draft[ action.bin_id ];

		switch ( action.type ) {
			case 'createBin':
				draft[ action.bin_id ] = {
					id: action.bin_id,
					items: [],
				};
				break;

			case 'createItemFitted':
			case 'createItem':
				bin.items.push( action.item_id );
				break;

			case 'deleteItem':
				let itemIndex = bin.items.indexOf( action.item_id );

				if ( itemIndex != -1 ) {
					bin.items.splice( itemIndex, 1 );
				}

				break;

			case 'load':
				return action.bins;
		}
	} );
}

function itemsReducer( items = {}, action ) {
	return immer( items, draft => {
		let item = draft[ action.item_id ];

		switch ( action.type ) {
			case 'createItemFitted':
			case 'createItem':
				draft[ action.item_id ] = {
					id: action.item_id,
					name: action.name,
					size: action.size,
					timeCreated: new Date(),
					timeUpdated: new Date(),
				};
				break;

			case 'deleteItem':
				delete draft[ action.item_id ];
				break;

			case 'updateItem':
				draft[ action.item_id ] = u(
					u( {timeUpdated: new Date()}, action.changes ),
					item,
				);
				break;

			case 'load':
				return immer( action.items, loadedItemsDraft => {
					for ( let id in action.items ) {
						loadedItemsDraft[ id ].id = parseInt( id );
					}
				} );
		}
	} );
}

const coreReducer = redux.combineReducers( {
	filters: filtersReducer,
	isModified: isModifiedReducer,
	locations: locationsReducer,
	bins: binsReducer,
	items: itemsReducer,
} );

const persistedReducer = persistReducer(
	{
		key: 'root',
		storage,
		whitelist: [ 'locations', 'bins', 'items' ],

		migrate,
		version: MIGRATE_VERSION,
	},
	coreReducer,
);

export function createOurStore() {
	let creator = composeWithDevTools(
		redux.applyMiddleware( thunkMiddleware )
	)( redux.createStore );
	let store = creator( persistedReducer );
	persistStore( store );

	return store;
}
