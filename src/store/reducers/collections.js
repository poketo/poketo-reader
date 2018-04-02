// @flow

import utils from '../../utils';

import type { Collection, Series } from '../../types';
import type {
  FetchStatusState,
  ThunkAction,
  SetCollectionAction,
  SetBookmarkAction,
  RemoveBookmarkAction,
} from '../types';

type Action = SetCollectionAction | SetBookmarkAction | RemoveBookmarkAction;

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

export function fetchCollection(slug: string): ThunkAction {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_COLLECTION_STATUS',
      payload: { isFetching: true },
    });

    api.fetchCollection(slug).then(response => {
      const unnormalized = response.data;
      const chapterData = utils
        .flatten(unnormalized.series.map(series => series.chapters))
        .filter(Boolean);
      const chapters = utils.keyArrayBy(chapterData, obj => obj.id);

      dispatch({
        type: 'SET_MULTIPLE_CHAPTERS',
        payload: chapters,
      });

      const series = utils.keyArrayBy(unnormalized.series, obj => obj.id);

      dispatch({
        type: 'SET_MULTIPLE_SERIES',
        payload: series,
      });

      const bookmarks = utils.keyArrayBy(
        unnormalized.collection.bookmarks,
        obj => obj.id,
      );

      dispatch({
        type: 'SET_COLLECTION',
        payload: {
          slug,
          bookmarks,
        },
      });

      dispatch({
        type: 'SET_COLLECTION_STATUS',
        payload: { isFetching: false, errorMessage: null },
      });
    });
  };
}

/**
 * Add a series to a collection.
 */
export function addBookmark(
  collectionSlug: string,
  collection: Collection,
  series: Series,
): ThunkAction {
  return dispatch => {
    // NOTE: it's important that series comes first here so that the series data
    // is in the store by the time we re-render the collection to look for it.
    dispatch({ type: 'SET_SERIES', payload: series });
    dispatch({ type: 'SET_COLLECTION', payload: collection });
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
    const collection = getState().collections[collectionSlug];
    const bookmark = collection.bookmarks[seriesId];
    dispatch({
      type: 'SET_BOOKMARK',
      payload: {
        ...bookmark,
        lastReadAt,
      },
    });

    // We don't handle the response since we pass this info optimistically.
    api.fetchMarkAsRead(collectionSlug, seriesId, lastReadAt).catch(err => {
      // swallow errors
    });
  };
}

const initialCollectionState = {
  _status: {
    isFetching: false,
    isAddingBookmark: false,
    errorMessage: null,
  },
};

export default function collectionReducer(
  state: State = initialCollectionState,
  action: Action,
): State {
  switch (action.type) {
    case 'SET_COLLECTION':
      return {
        ...state,
        [action.payload.slug]: {
          ...state[action.payload.slug],
          ...action.payload,
        },
      };
    case 'SET_BOOKMARK':
      const { collectionSlug, seriesId, bookmark } = action.payload;
      const bookmarks = state[collectionSlug].bookmarks;
      return {
        ...state,
        [collectionSlug]: {
          ...state[collectionSlug],
          bookmarks: {
            ...bookmarks,
            [seriesId]: {
              ...bookmarks[seriesId],
              ...bookmark,
            },
          },
        },
      };
    case 'REMOVE_BOOKMARK':
      const nextState = { ...state };
      const collection = nextState[action.payload.collectionSlug];
      delete collection.bookmarks[action.payload.seriesId];
      return nextState;
    case 'SET_COLLECTION_STATUS':
      return {
        ...state,
        _status: {
          ...state._status,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}
