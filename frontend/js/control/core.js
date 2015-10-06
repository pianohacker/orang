import * as redux from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import u from 'updeep';

const DEFAULT_FILTERS = {
	search: '',
};

function _arrayAdd(val) {
	return (arr) => [].concat(arr, [val]);
}

function filtersReducer(filters = DEFAULT_FILTERS, action) {
	switch (action.type) {
		case 'setSearch':
			return u({ search: action.search }, filters);

		default: return filters;
	}
}

function locationsReducer(locations = [], action) {
	console.debug('Action:', action);
	var loc_index = _.findIndex(locations, (location) => location.id == action.loc_id);

	switch (action.type) {
		case 'createBin':
			return u({
				[loc_index]: {
					bins: _arrayAdd([]),
				}
			}, locations);

		case 'createItem':
			return u({
				[loc_index]: {
					bins: {
						[action.bin_no]: _arrayAdd({name: action.name, size: 1}),
					},
				}
			}, locations);

		case 'createLocation':
			var id = _.max(locations, (location) => location.id) + 1;

			return u(_arrayAdd({id: id, name: action.name, bins: [[]]}), locations);

		case 'deleteItem':
			return u({
				[loc_index]: {
					bins: {
						[action.bin_no]: (arr) => [].concat(arr.slice(0, action.index), arr.slice(action.index + 1)),
					},
				}
			}, locations);

		case 'load':
			return action.locations;

		case 'updateItem':
			return u({
				[loc_index]: {
					bins: {
						[action.bin_no]: {
							[action.index]: u(action.changes),
						},
					},
				}
			}, locations);

		default: return locations;
	}
}

export const coreReducer = redux.combineReducers({
	filters: filtersReducer,
	locations: locationsReducer,
});

export const createOurStore = redux.applyMiddleware(thunkMiddleware)(redux.createStore);
