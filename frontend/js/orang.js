import React from 'react';
import { Provider } from 'react-redux';

import * as actions from './control/actions';
import { createOurStore } from './control/core';
import App from './ui/app';

import fetch_polyfill from 'fetch-ie8';
const fetch = window.fetch || fetch_polyfill;

const store = createOurStore();
store.dispatch(actions.load());
store.subscribe(() => {
	var state = store.getState();
	if (!state.isModified) return false;
	store.dispatch(actions.save());
});

React.render(
	<Provider store={store}>
		{() => <App />}
	</Provider>,
	document.body
);
