// @flow

import { normalize } from 'normalizr';
import schema from '../schema';

import type { Slug, Chapter, ChapterMetadata } from '../../types';
import type {
  FetchStatusState,
  ThunkAction,
  AddEntitiesAction,
  SetMultipleChaptersAction,
  SetChapterAction,
  SetChapterStatusAction,
} from '../types';

type Action =
  | AddEntitiesAction
  | SetMultipleChaptersAction
  | SetChapterAction
  | SetChapterStatusAction;

type State = {
  _status: FetchStatusState,
  [id: string]: Chapter | ChapterMetadata,
};

export function fetchChapterIfNeeded(
  siteId: string,
  series: Slug,
  chapter: Slug,
): ThunkAction {
  return (dispatch, getState) => {
    dispatch(fetchChapter(siteId, series, chapter));
  };
}

export function fetchChapter(
  siteId: string,
  series: Slug,
  chapter: Slug,
): ThunkAction {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_CHAPTER_STATUS',
      payload: { isFetching: true, errorMessage: null },
    });

    api.fetchChapter(siteId, series, chapter).then(
      response => {
        const normalized = normalize(response.data, schema.chapter);

        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });

        dispatch({
          type: 'SET_CHAPTER_STATUS',
          payload: { isFetching: false, errorMessage: null },
        });
      },
      err => {
        dispatch({
          type: 'SET_CHAPTER_STATUS',
          payload: { isFetching: false, errorMessage: err.stack },
        });
      },
    );
  };
}

const initialState = {
  _status: {
    isFetching: false,
    errorMessage: null,
  },
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'ADD_ENTITIES': {
      const chaptersById = action.payload.chapters;
      if (!chaptersById) {
        return state;
      }
      const nextState = { ...state };
      Object.keys(chaptersById).forEach(id => {
        nextState[id] = {
          ...nextState[id],
          ...chaptersById[id],
        };
      });
      return nextState;
    }
    case 'SET_CHAPTER': {
      return {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
    }
    case 'SET_CHAPTER_STATUS': {
      return { ...state, _status: { ...state._status, ...action.payload } };
    }
    default: {
      return state;
    }
  }
}
