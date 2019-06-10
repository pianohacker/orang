import '../scss/orang.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as actions from './control/actions';
import { createOurStore } from './control/core';
import App from './ui/app';

import fetch_polyfill from 'fetch-ie8';
window.fetch = window.fetch || fetch_polyfill;

const store = createOurStore();
store.dispatch( actions.load() );
store.subscribe( () => {
	let state = store.getState();
	if ( !state.isModified ) return false;
	store.dispatch( actions.save() );
} );

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById( 'react-root' ),
);
