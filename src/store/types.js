// @flow

import api from '../api';
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type { Chapter, ChapterMetadata, Series } from 'poketo';
import type { BookmarkLastReadChapterId, Collection } from '../types';

type ActionType<A, B> = { +type: A, +payload: B };
type ActionWithoutPayloadType<A> = { +type: A };

export type FetchStatus = 'fetching' | 'fetched' | 'error';
export type ErrorCode = 'NOT_FOUND' | 'TIMED_OUT' | 'UNKNOWN_ERROR';

export type EntityStatus = {
  +didInvalidate: boolean,
  +fetchStatus: FetchStatus,
  +errorCode?: ?ErrorCode,
  +lastFetchedAt: number,
};

type EntityStatusActionPayload = {
  +didInvalidate?: boolean,
  +fetchStatus?: FetchStatus,
  +errorCode?: ?ErrorCode,
  +lastFetchedAt?: number,
};

export type FetchStatusState = {|
  +isFetching: boolean,
  +errorCode?: ?ErrorCode,
|};

type StatusActionPayload = {|
  isFetching?: boolean,
  errorCode?: ?ErrorCode,
|};

export type EntitiesPayload = {
  collections?: { [slug: string]: Collection },
  chapters?: { [id: string]: Chapter | ChapterMetadata },
  series?: { [id: string]: Series },
};

export type AddEntitiesAction = ActionType<'ADD_ENTITIES', EntitiesPayload>;

export type SetCollectionAction = ActionType<'SET_COLLECTION', Collection>;
export type SetCollectionEntityStatusAction = ActionType<
  'SET_COLLECTION_ENTITY_STATUS',
  { slug: string, status: EntityStatusActionPayload },
>;
export type RemoveBookmarkAction = ActionType<
  'REMOVE_BOOKMARK',
  { collectionSlug: string, seriesId: string },
>;
export type AddBookmarkAction = ActionType<
  'ADD_BOOKMARK',
  { collectionSlug: string, seriesId: string, seriesUrl: string },
>;
export type MarkBookmarkAsReadAction = ActionType<
  'MARK_BOOKMARK_AS_READ',
  {
    collectionSlug: string,
    seriesId: string,
    options: {
      lastReadAt: number,
      lastReadChapterId: BookmarkLastReadChapterId,
    },
  },
>;
export type SetSeriesAction = ActionType<'SET_SERIES', Series>;
export type SetSeriesEntityStatusAction = ActionType<
  'SET_SERIES_ENTITY_STATUS',
  { id: string, status: EntityStatusActionPayload },
>;
export type SetChapterAction = ActionType<
  'SET_CHAPTER',
  Chapter | ChapterMetadata,
>;
export type SetChapterStatusAction = ActionType<
  'SET_CHAPTER_STATUS',
  StatusActionPayload,
>;

export type SetDefaultCollectionAction = ActionType<
  'SET_DEFAULT_COLLECTION',
  string,
>;
export type ClearDefaultCollectionAction = ActionWithoutPayloadType<
  'CLEAR_DEFAULT_COLLECTION',
>;

export type CollectionAction =
  | AddEntitiesAction
  | SetCollectionAction
  | SetCollectionEntityStatusAction
  | MarkBookmarkAsReadAction
  | AddBookmarkAction
  | RemoveBookmarkAction;

export type SeriesAction =
  | AddEntitiesAction
  | SetSeriesAction
  | SetSeriesEntityStatusAction;

export type ChapterAction =
  | AddEntitiesAction
  | SetChapterAction
  | SetChapterStatusAction;

export type AuthAction =
  | SetDefaultCollectionAction
  | ClearDefaultCollectionAction;

export type Action =
  | AuthAction
  | CollectionAction
  | SeriesAction
  | ChapterAction;

export type Dispatch = ReduxDispatch;
export type GetState = () => Object;
export type Thunk = (
  dispatch: Dispatch,
  getState: GetState,
  api: typeof api,
) => void;

export type Store = ReduxStore<any, Action>;
