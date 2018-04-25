// @flow

import { normalize } from 'normalizr';
import schema from '../schema';
import { shouldFetchSeries, fetchSeries } from './series';
import utils from '../../utils';

import type { Id, Slug, Collection } from '../../types';
import type { EntityStatus, Thunk, CollectionAction } from '../types';

type Action = CollectionAction;

type State = {
  +_status: { [slug: Slug]: EntityStatus },
  +[slug: Slug]: Collection,
};

export function fetchCollectionIfNeeded(slug: Slug): Thunk {
  return (dispatch, getState) => {
    if (shouldFetchCollection(getState(), slug)) {
      dispatch(fetchCollection(slug));
    }
  };
}

const STALE_AFTER = 15 * 1000 * 60; // 15 minutes

function shouldFetchCollection(state: Object, slug: Slug): boolean {
  const collections = state.collections;
  const status = collections._status[slug];

  switch (status && status.fetchStatus) {
    case 'fetching':
      return false;
    case 'fetched':
      const isStale = utils.getTimestamp() - status.lastFetchedAt > STALE_AFTER;
      return status.didInvalidate || isStale;
    default:
      return true;
  }
}

function getSeriesIdForCollection(state: State, slug: Slug): ?(Id[]) {
  const collection = state.collections[slug];

  if (!collection) {
    return null;
  }

  return Object.keys(collection.bookmarks);
}

export function fetchCollection(slug: Slug): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_COLLECTION_ENTITY_STATUS',
      payload: { slug, status: { fetchStatus: 'fetching' } },
    });

    api
      .fetchCollection(slug)
      .then(response => {
        const unnormalized = response.data;
        const normalized = normalize(unnormalized, schema.collection);

        dispatch({
          type: 'SET_COLLECTION_ENTITY_STATUS',
          payload: {
            slug,
            status: {
              fetchStatus: 'fetched',
              errorCode: null,
              lastFetchedAt: utils.getTimestamp(),
            },
          },
        });

        dispatch({
          type: 'ADD_ENTITIES',
          payload: normalized.entities,
        });
      })
      .catch(err => {
        const errorCode =
          err.response.status === 404 ? 'NOT_FOUND' : 'UNKNOWN_ERROR';

        dispatch({
          type: 'SET_COLLECTION_ENTITY_STATUS',
          payload: { slug, status: { fetchStatus: 'error', errorCode } },
        });
      });
  };
}

export function fetchSeriesForCollection(collectionSlug: Slug): Thunk {
  return (dispatch, getState, api) => {
    const state = getState();
    const seriesIds = getSeriesIdForCollection(state, collectionSlug);

    if (!seriesIds) {
      return;
    }

    const missingSeries = seriesIds.filter(id => shouldFetchSeries(state, id));

    missingSeries.forEach(id => {
      const { siteId, seriesSlug } = utils.getIdComponents(id);
      dispatch(fetchSeries(siteId, seriesSlug));
    });
  };
}

/**
 * Delete a bookmark from a collection.
 */
export function removeBookmark(collectionSlug: Slug, seriesId: Id): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'REMOVE_BOOKMARK',
      payload: { collectionSlug, seriesId },
    });

    api
      .fetchRemoveBookmarkFromCollection(collectionSlug, seriesId)
      .catch(err => {
        // swallow errors
      });
  };
}

export function markSeriesAsRead(
  collectionSlug: Slug,
  seriesId: Id,
  lastReadAt: number,
): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'MARK_BOOKMARK_AS_READ',
      payload: { collectionSlug, seriesId, lastReadAt },
    });

    // We don't handle the response since we pass this info optimistically.
    api.fetchMarkAsRead(collectionSlug, seriesId, lastReadAt).catch(err => {
      // swallow errors
    });
  };
}

const initialState = {
  _status: {},
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'ADD_ENTITIES': {
      const collectionsBySlug = action.payload.collections;
      if (!collectionsBySlug) {
        return state;
      }
      const nextState = { ...state };
      Object.keys(collectionsBySlug).forEach(slug => {
        nextState[slug] = {
          ...nextState[slug],
          ...collectionsBySlug[slug],
        };
      });
      return nextState;
    }
    case 'SET_COLLECTION': {
      return {
        ...state,
        [action.payload.slug]: {
          ...state[action.payload.slug],
          ...action.payload,
        },
      };
    }
    case 'MARK_BOOKMARK_AS_READ': {
      const { collectionSlug, seriesId, lastReadAt } = action.payload;
      const collection = state[collectionSlug];
      const bookmarks = {
        ...collection.bookmarks,
        [seriesId]: {
          ...collection.bookmarks[seriesId],
          lastReadAt,
        },
      };

      return {
        ...state,
        [collectionSlug]: {
          ...state[collectionSlug],
          bookmarks,
        },
      };
    }
    case 'REMOVE_BOOKMARK': {
      const nextState = { ...state };
      const collection = nextState[action.payload.collectionSlug];
      delete collection.bookmarks[action.payload.seriesId];
      return nextState;
    }
    case 'SET_COLLECTION_ENTITY_STATUS': {
      return {
        ...state,
        _status: {
          ...state._status,
          [action.payload.slug]: {
            ...state._status[action.payload.slug],
            ...action.payload.status,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}
