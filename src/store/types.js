// @flow

import api from '../api';

import type { Collection, Chapter, ChapterMetadata, Series } from '../types';

type ActionType<A, B> = { type: A, payload: B };

type StatusActionFetchPayload = {
  isFetching?: boolean,
  errorCode?: ?string,
};

export type AddEntitiesAction = ActionType<
  'ADD_ENTITIES',
  {
    collections?: { [slug: string]: Collection },
    chapters?: { [id: string]: Chapter | ChapterMetadata },
    series?: { [id: string]: Series },
  },
>;

export type SetCollectionAction = ActionType<'SET_COLLECTION', Collection>;
export type SetCollectionStatusAction = ActionType<
  'SET_COLLECTION_STATUS',
  StatusActionFetchPayload,
>;
export type RemoveBookmarkAction = ActionType<
  'REMOVE_BOOKMARK',
  { collectionSlug: string, seriesId: string },
>;
export type MarkBookmarkAsReadAction = ActionType<
  'MARK_BOOKMARK_AS_READ',
  { collectionSlug: string, seriesId: string, lastReadAt: number },
>;
export type SetMultipleSeriesAction = ActionType<
  'SET_MULTIPLE_SERIES',
  { [id: string]: Series },
>;
export type SetSeriesAction = ActionType<'SET_SERIES', Series>;
export type SetSeriesStatusAction = ActionType<
  'SET_SERIES_STATUS',
  StatusActionFetchPayload,
>;
export type SetMultipleChaptersAction = ActionType<
  'SET_MULTIPLE_CHAPTERS',
  { [id: string]: Chapter | ChapterMetadata },
>;
export type SetChapterAction = ActionType<
  'SET_CHAPTER',
  Chapter | ChapterMetadata,
>;
export type SetChapterStatusAction = ActionType<
  'SET_CHAPTER_STATUS',
  StatusActionFetchPayload,
>;

export type FetchStatusState = {
  +isFetching: boolean,
  +errorCode: ?string,
};

export type Action =
  | AddEntitiesAction
  // Collection
  | SetCollectionAction
  | SetCollectionStatusAction
  | MarkBookmarkAsReadAction
  | RemoveBookmarkAction
  // Series
  | SetSeriesAction
  | SetMultipleSeriesAction
  | SetSeriesStatusAction
  // Chapter
  | SetChapterAction
  | SetMultipleChaptersAction
  | SetChapterStatusAction;

export type Dispatch = (action: Action | ThunkAction) => void;
export type GetState = () => Object;
export type ThunkAction = (
  dispatch: Dispatch,
  getState: GetState,
  api: typeof api,
) => void;
