// @flow

import getPersistMiddleware from 'redux-persist-middleware';

const actionMap: { [string]: string[] } = {
  ADD_ENTITIES: ['series', 'collections', 'chapters'],
};

type Cache = {
  set: (key: string, value: string) => Promise<void>,
  get: (key: string, value: string) => Promise<void>,
};

/**
 * Local caching middleware
 *
 * This middleware intercepts any actions that modify entities on the local DB
 * and caches them to LocalStorage or IndexedDB.
 */

export default (cache: Cache) =>
  getPersistMiddleware({
    cacheFn: cache.set,
    actionMap,
  });
