import React from 'react';
import { Provider } from 'react-redux';

import * as actions from './control/actions';
import { createOurStore } from './control/core';
import App from './ui/app';

// polyfill for redux-persistent
window.setImmediate = (func) => setTimeout(func, 0);

const store = createOurStore();
//store.dispatch(actions.load());

React.render(
	<Provider store={store}>
		{() => <App />}
	</Provider>,
	document.body
);
