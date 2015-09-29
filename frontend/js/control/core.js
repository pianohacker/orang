import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import u from 'updeep';

const DEFAULT_STATE = {
	locations: [],
	search: '',
};

function _arrayAdd(val) {
	return (arr) => [].concat(arr, [val])
}

export function coreReducer(state = DEFAULT_STATE, action) {
	console.debug('Action:', action);

	switch (action.type) {
		case 'createBin':
			var index = _.findIndex(state.locations, (location) => location.id == action.loc_id);
			return u({
				locations: {
					[index]: {
						bins: _arrayAdd([]),
					}
				},
			}, state);

		case 'createItem':
			var index = _.findIndex(state.locations, (location) => location.id == action.loc_id);
			return u({
				locations: {
					[index]: {
						bins: {
							[action.bin_no]: _arrayAdd({name: action.name}),
						},
					}
				},
			}, state);

		case 'createLocation':
			var id = _.max(state.locations, (location) => location.id);
			return u({
				locations: _arrayAdd({id: id, name: action.name, bins: [[]]})
			}, state);

		case 'deleteItem':
			var index = _.findIndex(state.locations, (location) => location.id == action.loc_id);
			return u({
				locations: {
					[index]: {
						bins: {
							[action.bin_no]: (arr) => [].concat(arr.slice(0, action.index), arr.slice(action.index + 1)),
						},
					}
				},
			}, state);

		case 'load':
			return u({
				locations: action.locations
			}, state);

		case 'setSearch':
			return u({ search: action.search }, state);

		case 'updateItem':
			var index = _.findIndex(state.locations, (location) => location.id == action.loc_id);
			return u({
				locations: {
					[index]: {
						bins: {
							[action.bin_no]: {
								[action.index]: u(action.changes),
							},
						},
					}
				},
			}, state);

		default: return state;
	}
}

export const createOurStore = applyMiddleware(thunkMiddleware)(createStore);
