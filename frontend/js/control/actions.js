import _ from 'lodash';
import u from 'updeep';

const DEFAULT_DATA = {
	locations: [
		{
			id: 1,
			name: 'Hex',
			bins: [
				[],
				[],
				[
					{ name: 'Measuring Tape' },
				],
				[],
			],
		},
		{
			id: 2,
			name: 'Cables',
			bins: [
				[
					{ name: 'Micro USB Cables' },
				],
				[],
				[
					{ name: 'HDMI Cables' },
				],
				[],
			],
		}
	],
};

function _action(name, ...fields) {
	var postCreate = (action) => action;
	if (typeof(fields[fields.length-1]) == 'function') postCreate = fields.pop();

	return function(...values) {
		return postCreate(u(
			_.zipObject(fields, values),
			{type: name}
		));
	};
}

function _save(state) {
	localStorage.orangData = JSON.stringify({locations: state.locations});
}

export const createBin = _action('createBin', 'loc_id', (action) => (dispatch, getState) => {
	dispatch(action);
	_save(getState());
});
export const createItem = _action('createItem', 'loc_id', 'bin_no', (action) => (dispatch, getState) => {
	dispatch(u({name: prompt("Name of item:")}, action));
	_save(getState());
});
export const createLocation = _action('createLocation', (action) => (dispatch, getState) => {
	dispatch(u({name: prompt("Name of location:")}, action));
	_save(getState());
});
export const load = _action('load', (action) => (dispatch) => {
	if (localStorage.orangData) {
		dispatch(u(JSON.parse(localStorage.orangData), action));
	} else {
		dispatch(u(DEFAULT_DATA, action));
	}
});
export const setSearch = _action('setSearch', 'search');
