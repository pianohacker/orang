import React from 'react';
import { Provider } from 'react-redux';

import * as actions from './control/actions';
import { coreReducer, createOurStore } from './control/core';
import App from './ui/app';

const store = createOurStore(coreReducer);
store.dispatch(actions.load());

React.render(
	<Provider store={store}>
		{() => <App />}
	</Provider>,
	document.body
);
