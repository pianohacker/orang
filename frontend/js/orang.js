import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './ui/app';
import { coreReducer } from './control/core';

React.render(
	<Provider store={createStore(coreReducer)}>
		{() => <App />}
	</Provider>,
	document.body
);
