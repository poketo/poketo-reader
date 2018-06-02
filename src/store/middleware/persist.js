// @flow

import type { Middleware } from 'redux';
import type { Action, Dispatch } from '../types';

type Cache = {
  set: (key: string, value: mixed) => Promise<void>,
  get: (key: string) => Promise<void>,
};

type Options = {
  cache: Cache,
  actionMap: { [string]: string[] },
  transformState?: (state: Object, key: string) => Object,
};

const fallback = (cb, _) => setTimeout(cb, 0);
const onIdle =
  typeof requestIdleCallback === 'undefined' ? fallback : requestIdleCallback;

const defaultTransform = (state, key) => state;

/**
 * Local caching middleware
 *
 * This middleware intercepts any actions that modify entities on the local DB
 * and caches them to LocalStorage or IndexedDB.
 */

export default function(options: Options): Middleware<any, Action, Dispatch> {
  const transformState = options.transformState || defaultTransform;

  return store => next => action => {
    const reducers = options.actionMap[action.type];
    const result = next(action);

    if (reducers) {
      const state = store.getState();

      onIdle(
        () => {
          Promise.all(
            reducers.map(key => {
              const value = transformState(state[key], key);
              return options.cache.set(key, value);
            }),
          );
        },
        { timeout: 500 },
      );
    }

    return result;
  };
}
