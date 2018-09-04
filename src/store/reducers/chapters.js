// @flow

import { normalize } from 'normalizr';
import schema from '../schema';
import utils from '../../utils';

import type { Chapter, ChapterMetadata } from 'poketo';
import type { FetchStatusState, Thunk, ChapterAction } from '../types';

type Action = ChapterAction;

type State = {
  _status: FetchStatusState,
  [id: string]: Chapter | ChapterMetadata,
};

export function isFullChapter(chapter: ?(Chapter | ChapterMetadata)): boolean {
  return Boolean(chapter && chapter.pages && Array.isArray(chapter.pages));
}

export function fetchChapterIfNeeded(chapterId: string): Thunk {
  return (dispatch, getState) => {
    if (shouldFetchChapter(getState(), chapterId)) {
      dispatch(fetchChapter(chapterId));
    }
  };
}

function shouldFetchChapter(state: Object, chapterId: string): boolean {
  const chaptersById = state.chapters;

  if (isFullChapter(chaptersById[chapterId])) {
    return false;
  }

  return true;
}

export function fetchChapter(chapterId: string): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_CHAPTER_STATUS',
      payload: { isFetching: true, errorCode: null },
    });

    api.fetchChapter(chapterId).then(
      response => {
        const normalized = normalize(response.data, schema.chapter);

        dispatch({
          type: 'SET_CHAPTER_STATUS',
          payload: { isFetching: false, errorCode: null },
        });
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
      },
      err => {
        const errorCode = err.response ? 'UNKNOWN_ERROR' : 'TIMED_OUT';

        dispatch({
          type: 'SET_CHAPTER_STATUS',
          payload: { isFetching: false, errorCode },
        });
      },
    );
  };
}

const initialState = {
  _status: {
    isFetching: false,
    errorCode: null,
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
      return utils.set(state, action.payload.id, prev => ({
        ...prev,
        ...action.payload,
      }));
    }
    case 'SET_CHAPTER_STATUS': {
      return utils.set(state, '_status', prev => ({
        ...prev,
        ...action.payload,
      }));
    }
    default: {
      return state;
    }
  }
}
