import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

//import thunk from 'redux-thunk';
import { serverRequestsReducer, otherReducer } from './reducers';

import { thunk } from 'redux-thunk';

const reducer = combineReducers({
	serverState: serverRequestsReducer,
	otherState: otherReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
	reducer,
	composeEnhancers(applyMiddleware(thunk)),
);
