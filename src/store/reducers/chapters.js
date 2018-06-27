// @flow

import { normalize } from 'normalizr';
import schema from '../schema';
import utils from '../../utils';

import type { Id, SiteId, Slug, Chapter, ChapterMetadata } from '../../types';
import type { FetchStatusState, Thunk, ChapterAction } from '../types';

type Action = ChapterAction;

type State = {
  _status: FetchStatusState,
  [id: Id]: Chapter | ChapterMetadata,
};

export function isFullChapter(chapter: ?Chapter | ?ChapterMetadata): boolean {
  return Boolean(chapter && Array.isArray(chapter.pages));
}

export function fetchChapterIfNeeded(
  siteId: SiteId,
  series: Slug,
  chapter: Slug,
): Thunk {
  return (dispatch, getState) => {
    if (shouldFetchChapter(getState(), siteId, series, chapter)) {
      dispatch(fetchChapter(siteId, series, chapter));
    }
  };
}

function shouldFetchChapter(
  state: Object,
  siteId: SiteId,
  seriesSlug: Slug,
  chapterSlug: Slug,
): boolean {
  const chaptersById = state.chapters;
  const chapterId = utils.getId(siteId, seriesSlug, chapterSlug);

  if (isFullChapter(chaptersById[chapterId])) {
    return false;
  }

  return true;
}

export function fetchChapter(
  siteId: SiteId,
  series: Slug,
  chapter: Slug,
): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_CHAPTER_STATUS',
      payload: { isFetching: true, errorMessage: null },
    });

    api.fetchChapter(siteId, series, chapter).then(
      response => {
        const normalized = normalize(response.data, schema.chapter);

        dispatch({
          type: 'SET_CHAPTER_STATUS',
          payload: { isFetching: false, errorCode: null },
        });
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
      },
      err => {
        dispatch({
          type: 'SET_CHAPTER_STATUS',
          payload: { isFetching: false, errorCode: 'UNKNOWN_ERROR' },
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
