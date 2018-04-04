// @flow

import { normalize } from 'normalizr';
import schema from '../schema';
import { isSeriesUpToDate } from './series';
import utils from '../../utils';

import type { Collection } from '../../types';
import type { FetchStatusState, ThunkAction, CollectionAction } from '../types';

type Action = CollectionAction;

type State = {
  +_status: FetchStatusState,
  +[slug: string]: Collection,
};

export function fetchCollectionIfNeeded(slug: string): ThunkAction {
  return (dispatch, getState) => {
    if (shouldFetchCollection(getState(), slug)) {
      dispatch(fetchCollection(slug));
    }
  };
}

function shouldFetchCollection(state, slug): boolean {
  const collections = state.collections;

  if (collections._status.isFetching) {
    return false;
  } else if (collections[slug]) {
    return false;
  }

  return true;
}

function getSeriesIdForCollection(state, slug): ?(string[]) {
  const collection = state.collections[slug];

  if (!collection) {
    return null;
  }

  return Object.keys(collection.bookmarks);
}

export function fetchCollection(slug: string): ThunkAction {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_COLLECTION_STATUS',
      payload: { isFetching: true },
    });

    api
      .fetchCollection(slug)
      .then(response => {
        const unnormalized = response.data;
        const normalized = normalize(unnormalized, schema.collection);

        dispatch({
          type: 'ADD_ENTITIES',
          payload: normalized.entities,
        });

        dispatch({
          type: 'SET_COLLECTION_STATUS',
          payload: { isFetching: false, errorCode: null },
        });
      })
      .catch(err => {
        const errorCode = err.status === 404 ? 'NOT_FOUND' : 'UNKNOWN_ERROR';

        dispatch({
          type: 'SET_COLLECTION_STATUS',
          payload: { isFetching: false, errorCode },
        });
      });
  };
}

export function fetchSeriesForCollection(collectionSlug: string): ThunkAction {
  return (dispatch, getState, api) => {
    const state = getState();
    const seriesIds = getSeriesIdForCollection(state, collectionSlug);

    if (!seriesIds) {
      return;
    }

    const missingSeries = seriesIds.filter(id => !isSeriesUpToDate(state, id));
    const requests = missingSeries.map(id => {
      const { siteId, seriesSlug } = utils.getIdComponents(id);
      return api.fetchSeries(siteId, seriesSlug).then(response => {
        const unnormalized = response.data;
        const normalized = normalize(unnormalized, schema.series);

        dispatch({
          type: 'ADD_ENTITIES',
          payload: normalized.entities,
        });
      });
    });

    Promise.all(requests).catch(err => {
      console.log(err);
    });
  };
}

/**
 * Delete a bookmark from a collection.
 */
export function removeBookmark(
  collectionSlug: string,
  seriesId: string,
): ThunkAction {
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
  collectionSlug: string,
  seriesId: string,
  lastReadAt: number,
): ThunkAction {
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
  _status: {
    isFetching: false,
    isAddingBookmark: false,
    errorCode: null,
  },
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
    case 'SET_COLLECTION_STATUS': {
      return {
        ...state,
        _status: {
          ...state._status,
          ...action.payload,
        },
      };
    }
    default: {
      return state;
    }
  }
}
