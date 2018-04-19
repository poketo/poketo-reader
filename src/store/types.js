// @flow

import api from '../api';
import type { Store as ReduxStore } from 'redux';
import type {
  Slug,
  Id,
  Collection,
  Chapter,
  ChapterMetadata,
  Series,
} from '../types';

type ActionType<A, B> = { type: A, payload: B };

export type FetchStatus = 'fetching' | 'fetched' | 'error';
export type ErrorCode = 'NOT_FOUND' | 'UNKNOWN_ERROR';

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

export type FetchStatusState = {
  +isFetching: boolean,
  +errorCode?: ?ErrorCode,
};

type StatusActionPayload = {
  isFetching?: boolean,
  errorCode?: ?ErrorCode,
};

export type EntitiesPayload = {
  collections?: { [slug: Slug]: Collection },
  chapters?: { [id: Id]: Chapter | ChapterMetadata },
  series?: { [id: Id]: Series },
};

export type AddEntitiesAction = ActionType<'ADD_ENTITIES', EntitiesPayload>;

export type SetCollectionAction = ActionType<'SET_COLLECTION', Collection>;
export type SetCollectionEntityStatusAction = ActionType<
  'SET_COLLECTION_ENTITY_STATUS',
  { slug: Slug, status: EntityStatusActionPayload },
>;
export type RemoveBookmarkAction = ActionType<
  'REMOVE_BOOKMARK',
  { collectionSlug: Slug, seriesId: Id },
>;
export type MarkBookmarkAsReadAction = ActionType<
  'MARK_BOOKMARK_AS_READ',
  { collectionSlug: Slug, seriesId: Id, lastReadAt: number },
>;
export type SetSeriesAction = ActionType<'SET_SERIES', Series>;
export type SetSeriesEntityStatusAction = ActionType<
  'SET_SERIES_ENTITY_STATUS',
  { id: Id, status: EntityStatusActionPayload },
>;
export type SetChapterAction = ActionType<
  'SET_CHAPTER',
  Chapter | ChapterMetadata,
>;
export type SetChapterStatusAction = ActionType<
  'SET_CHAPTER_STATUS',
  StatusActionPayload,
>;

export type CollectionAction =
  | AddEntitiesAction
  | SetCollectionAction
  | SetCollectionEntityStatusAction
  | MarkBookmarkAsReadAction
  | RemoveBookmarkAction;

export type SeriesAction =
  | AddEntitiesAction
  | SetSeriesAction
  | SetSeriesEntityStatusAction;

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

export type Store = ReduxStore<any, Action>;
