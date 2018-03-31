// @flow

import type { Slug, Chapter, ChapterPreview } from '../../types';
import type {
  FetchStatusState,
  ThunkAction,
  SetMultipleChaptersAction,
  SetChapterAction,
  SetChapterStatusAction,
} from '../types';

type Action =
  | SetMultipleChaptersAction
  | SetChapterAction
  | SetChapterStatusAction;

type State = {
  _status: FetchStatusState,
  [id: string]: Chapter | ChapterPreview,
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
        dispatch({
          type: 'SET_CHAPTER',
          payload: response.data,
        });

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
    case 'SET_MULTIPLE_CHAPTERS':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_CHAPTER':
      return {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
    case 'SET_CHAPTER_STATUS':
      return { ...state, _status: { ...state._status, ...action.payload } };
    default:
      return state;
  }
}
