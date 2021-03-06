// @flow

import { normalize } from 'normalizr';
import { fetchSeriesIfNeeded } from './series';
import schema from '../schema';
import utils from '../../utils';

import type { BookmarkLastReadChapterId, Collection } from '../../types';
import type { EntityStatus, Thunk, CollectionAction } from '../types';

type Action = CollectionAction;

type State = {
  +_status: { [slug: string]: EntityStatus },
  +[slug: string]: Collection,
};

export function fetchCollectionIfNeeded(slug: string): Thunk {
  return (dispatch, getState) => {
    if (shouldFetchCollection(getState(), slug)) {
      dispatch(fetchCollection(slug));
    }
  };
}

const STALE_AFTER = 600; // 10 minutes in seconds

function shouldFetchCollection(state: Object, slug: string): boolean {
  const collections = state.collections;
  const status = collections._status[slug];

  switch (status && status.fetchStatus) {
    case 'fetching':
      return false;
    case 'fetched':
      const isStale = utils.getTimestamp() - status.lastFetchedAt > STALE_AFTER;
      return status.didInvalidate || isStale;
    case 'error':
      return status.errorCode !== 'NOT_FOUND';
    default:
      return true;
  }
}

function getSeriesIdForCollection(state: State, slug: string): ?(string[]) {
  const collection = state.collections[slug];

  if (!collection) {
    return null;
  }

  return Object.keys(collection.bookmarks);
}

export function fetchCollection(slug: string): Thunk {
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
        let errorCode = 'UNKNOWN_ERROR';

        if (err.response) {
          errorCode =
            err.response.status === 404 ? 'NOT_FOUND' : 'UNKNOWN_ERROR';
        } else {
          errorCode = 'TIMED_OUT';
        }

        dispatch({
          type: 'SET_COLLECTION_ENTITY_STATUS',
          payload: { slug, status: { fetchStatus: 'error', errorCode } },
        });
      });
  };
}

export function fetchSeriesForCollection(collectionSlug: string): Thunk {
  return (dispatch, getState, api) => {
    const state = getState();
    const seriesIds = getSeriesIdForCollection(state, collectionSlug);

    if (!seriesIds) {
      return;
    }

    seriesIds.forEach(id => {
      dispatch(fetchSeriesIfNeeded(id));
    });
  };
}

/**
 * Add a bookmark to a collection.
 */
export function addBookmark(
  collectionSlug: string,
  seriesId: string,
  seriesUrl: string,
): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'ADD_BOOKMARK',
      payload: { collectionSlug, seriesId, seriesUrl },
    });

    api
      .fetchAddBookmarkToCollection(collectionSlug, seriesUrl)
      .then(response => {
        const normalized = normalize(response.data, {
          collection: schema.collection,
          series: schema.series,
        });
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
      })
      .catch(err => {
        // TODO: handle errors
      });
  };
}

/**
 * Delete a bookmark from a collection.
 */
export function removeBookmark(
  collectionSlug: string,
  seriesId: string,
): Action {
  return {
    type: 'REMOVE_BOOKMARK',
    payload: { collectionSlug, seriesId },
  };
}

export function markSeriesAsRead(
  collectionSlug: string,
  seriesId: string,
  options: { lastReadChapterId: BookmarkLastReadChapterId, lastReadAt: number },
): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'MARK_BOOKMARK_AS_READ',
      payload: { collectionSlug, seriesId, options },
    });

    api.fetchMarkAsRead(collectionSlug, seriesId, options).catch(err => {
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
      return utils.set(state, `${action.payload.slug}`, prev => ({
        ...prev,
        ...action.payload,
      }));
    }
    case 'MARK_BOOKMARK_AS_READ': {
      const { collectionSlug, seriesId, options } = action.payload;
      const { lastReadAt, lastReadChapterId } = options;

      const withChapterId = utils.set(
        state,
        `${collectionSlug}.bookmarks.${seriesId}.lastReadChapterId`,
        lastReadChapterId,
      );
      const withTimestamp = utils.set(
        withChapterId,
        `${collectionSlug}.bookmarks.${seriesId}.lastReadAt`,
        lastReadAt,
      );

      return withTimestamp;
    }
    case 'ADD_BOOKMARK': {
      const { collectionSlug, seriesId, seriesUrl } = action.payload;

      return utils.set(state, `${collectionSlug}.bookmarks.${seriesId}`, {
        id: seriesId,
        url: seriesUrl,
        lastReadChapterId: null,
        lastReadAt: utils.getTimestamp(),
      });
    }
    case 'REMOVE_BOOKMARK': {
      const nextState = { ...state };
      const collection = nextState[action.payload.collectionSlug];
      delete collection.bookmarks[action.payload.seriesId];
      return nextState;
    }
    case 'SET_COLLECTION_ENTITY_STATUS': {
      const { slug, status } = action.payload;

      return utils.set(state, `_status.${slug}`, prev => ({
        ...prev,
        ...status,
      }));
    }
    default: {
      return state;
    }
  }
}
