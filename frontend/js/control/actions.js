import { saveAs } from 'browser-filesaver/FileSaver';
import _ from 'lodash';
import u from 'updeep';

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

export const createBin = _action('createBin', 'loc_id');
export const createItem = _action('createItem', 'loc_id', 'bin_no', 'size', (action) => (dispatch, getState) => {
	dispatch(u({name: prompt("Name of item:")}, action));
});
export const createItemFitted = _action('createItemFitted', 'loc_id', 'size', (action) => (dispatch, getState) => {
	dispatch(u({name: prompt("Name of item:")}, action));
});
export const createLocation = _action('createLocation', (action) => (dispatch, getState) => {
	dispatch(u({name: prompt("Name of location:")}, action));
});
export const deleteItem = _action('deleteItem', 'loc_id', 'bin_no', 'index');
export const exportData = _action('exportData', (action) => (dispatch, getState) => {
	saveAs(new Blob([JSON.stringify(getState())], {type: 'application/json;charset=utf-8'}), 'orang.json');
});
export const setSearch = _action('setSearch', 'search');
export const updateItem = _action('updateItem', 'loc_id', 'bin_no', 'index', 'changes');
