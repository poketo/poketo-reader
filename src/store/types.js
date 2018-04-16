// @flow

import api from '../api';

import type { Collection, Chapter, ChapterMetadata, Series } from '../types';

type ActionType<A, B> = { type: A, payload: B };

type StatusActionPayload = {
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
  StatusActionPayload,
>;
export type RemoveBookmarkAction = ActionType<
  'REMOVE_BOOKMARK',
  { collectionSlug: string, seriesId: string },
>;
export type MarkBookmarkAsReadAction = ActionType<
  'MARK_BOOKMARK_AS_READ',
  { collectionSlug: string, seriesId: string, lastReadAt: number },
>;
export type SetSeriesAction = ActionType<'SET_SERIES', Series>;
export type SetSeriesStatusAction = ActionType<
  'SET_SERIES_STATUS',
  StatusActionPayload,
>;
export type SetChapterAction = ActionType<
  'SET_CHAPTER',
  Chapter | ChapterMetadata,
>;
export type SetChapterStatusAction = ActionType<
  'SET_CHAPTER_STATUS',
  StatusActionPayload,
>;

export type FetchStatusState = {
  +isFetching: boolean,
  +errorCode: ?string,
};

export type CollectionAction =
  | AddEntitiesAction
  | SetCollectionAction
  | SetCollectionStatusAction
  | MarkBookmarkAsReadAction
  | RemoveBookmarkAction;

export type SeriesAction =
  | AddEntitiesAction
  | SetSeriesAction
  | SetSeriesStatusAction;

export type ChapterAction =
  | AddEntitiesAction
  | SetChapterAction
  | SetChapterStatusAction;

export type Action = CollectionAction | SeriesAction | ChapterAction;

export type Dispatch = (action: Action | Thunk) => void;
export type GetState = () => Object;
export type Thunk = (
  dispatch: Dispatch,
  getState: GetState,
  api: typeof api,
) => void;
