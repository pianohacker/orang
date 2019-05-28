import _ from 'lodash';
import { denormalize, normalize } from 'normalizr';
import * as redux from 'redux';
import { createMigrate, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import thunkMiddleware from 'redux-thunk';
import u from 'updeep';

import * as schema from './schema';
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

function locationsReducer( locations = [], action ) {
	let loc_index = _.findIndex( locations, ( location ) => location.id == action.loc_id );

	switch ( action.type ) {
		case 'createBin':
			return u( {
				[ loc_index ]: {
					bins: _arrayAdd( [] ),
				},
			}, locations );

		case 'createItemFitted':
			// Randomly choose one of the emptiest bins
			let [ emptiest_bin ] = _( locations[ loc_index ].bins )
				.map( ( bin, i ) => [ i, _.sumBy( bin, ( item ) => parseInt( item.size || 1 ) ) ] )
				.shuffle()
				.minBy( 1 );

			action = u( {bin_no: emptiest_bin}, action );

			// fallthrough
		case 'createItem':
			return u( {
				[ loc_index ]: {
					bins: {
						[ action.bin_no ]: _arrayAdd( {
							name: action.name,
							size: action.size,
							timeCreated: new Date(),
							timeUpdated: new Date(),
						} ),
					},
				},
			}, locations );

		case 'createLocation':
			let id = _(locations).map((location) => location.id).max() + 1;

			return u( _arrayAdd( {id, name: action.name, bins: [ [] ]} ), locations );

		case 'deleteItem':
			return u( {
				[ loc_index ]: {
					bins: {
						[ action.bin_no ]: ( arr ) =>
							[].concat( arr.slice( 0, action.index ), arr.slice( action.index + 1 ) ),
					},
				},
			}, locations );

		case 'load':
			return action.locations;

		case 'updateItem':
			return u( {
				[ loc_index ]: {
					bins: {
						[ action.bin_no ]: {
							[ action.index ]: u( u( {timeUpdated: new Date()}, action.changes ) ),
						},
					},
				},
			}, locations );

		default: return locations;
	}
}

const coreReducer = redux.combineReducers( {
	filters: filtersReducer,
	isModified: isModifiedReducer,
	locations: locationsReducer,
} );

const persistedReducer = persistReducer(
	{
		key: 'root',
		storage,
		whitelist: [ 'locations' ],

		migrate,
		version: MIGRATE_VERSION,
	},
	coreReducer,
);

export function createOurStore() {
	let creator = redux.applyMiddleware( thunkMiddleware )( redux.createStore );
	let store = creator( persistedReducer );
	persistStore( store );

	return store;
}
