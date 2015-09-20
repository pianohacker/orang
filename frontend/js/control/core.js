import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import u from 'updeep';

const DEFAULT_STATE = {
	locations: [],
	search: '',
};

export function coreReducer(state = DEFAULT_STATE, action) {
	console.debug('action', action);
	switch (action.type) {
		case 'createLocation':
			return u({
				locations: (locations) => [].concat(locations, [{name: action.name, bins: [[]]}])
			}, state);
		case 'load':
			return u({
				locations: action.locations
			}, state);
		case 'setSearch':
			return u({ search: action.search }, state);

		default: return state;
	}
}

export const createOurStore = applyMiddleware(thunkMiddleware)(createStore);
