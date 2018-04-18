// @flow

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { getConfiguredCache } from 'money-clip';

import persist from './middleware/persist';
import reducer from './reducer';
import api from '../api';

const MS_IN_HOURS = 60 * 1000;

export default function getStore(): Promise<{}> {
  const cache = getConfiguredCache({
    version: process.env.REACT_APP_COMMIT_REF || 'development',
    maxAge: 1 * MS_IN_HOURS,
  });

  const middleware = [thunk.withExtraArgument(api), persist(cache)];

  if (process.env.NODE_ENV === 'development') {
    middleware.push(require('redux-logger').logger);
  }

  return cache.getAll().then(initialData => {
    const store = createStore(
      reducer,
      initialData,
      applyMiddleware(...middleware),
    );

    return store;
  });
}
