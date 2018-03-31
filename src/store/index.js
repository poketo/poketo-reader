// @flow

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import api from '../api';

const middleware = [thunk.withExtraArgument(api)];

if (process.env.NODE_ENV === 'development') {
  middleware.push(require('redux-logger').logger);
}

const store = createStore(reducer, applyMiddleware(...middleware));

export default store;
