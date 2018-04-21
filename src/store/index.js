// @flow

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import filter from 'filter-obj';

import persist from './middleware/persist';
import cache from './cache';
import reducer from './reducer';
import api from '../api';

import type { Store } from './types';

export default function getStore(): Promise<Store> {
  const middleware = [
    thunk.withExtraArgument(api),
    persist({
      cache,
      actionMap: {
        ADD_ENTITIES: ['series', 'collections', 'chapters'],
      },
      // NOTE: we want to filter out pieces of state where we're still fetching
      // so that we don't cache the fetching state and get caught in some
      // infinite loading.
      transformState: state => {
        const status = state._status;
        const nextStatus = filter(status, (id, status) => {
          return status && status.fetchStatus === 'fetched';
        });
        return { ...state, _status: nextStatus };
      },
    }),
  ];

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
