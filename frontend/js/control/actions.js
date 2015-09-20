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

function _save(data) {
	localStorage.orangData = JSON.stringify(data);
}

export const createLocation = _action('createLocation', (action) => (dispatch, getState) => {
	dispatch(u({name: prompt("Name of location:")}, action));
	_save({locations: getState().locations});
});
export const load = _action('load', (action) => (dispatch) => {
	if (localStorage.orangData) {
		dispatch(u(JSON.parse(localStorage.orangData), action));
	} else {
		dispatch(u(DEFAULT_DATA, action));
	}
});
export const setSearch = _action('setSearch', 'search');
