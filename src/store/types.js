// @flow

import api from '../api';
import type { Store as ReduxStore } from 'redux';
import type { Collection, Chapter, ChapterMetadata, Series } from '../types';

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
export type MarkBookmarkAsReadAction = ActionType<
  'MARK_BOOKMARK_AS_READ',
  { collectionSlug: string, seriesId: string, lastReadAt: number },
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

export type SetNetworkStatusAction = ActionType<'SET_NETWORK_STATUS', boolean>;

export type SetOrientationAction = ActionType<
  'SET_ORIENTATION',
  'landscape' | 'portrait',
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
  | RemoveBookmarkAction;

export type SeriesAction =
  | AddEntitiesAction
  | SetSeriesAction
  | SetSeriesEntityStatusAction;

export type ChapterAction =
  | AddEntitiesAction
  | SetChapterAction
  | SetChapterStatusAction;

export type DeviceAction = SetNetworkStatusAction | SetOrientationAction;

export type AuthAction =
  | SetDefaultCollectionAction
  | ClearDefaultCollectionAction;

export type Action =
  | AuthAction
  | CollectionAction
  | SeriesAction
  | ChapterAction
  | DeviceAction;

export type Dispatch = (action: Action | Thunk) => void;
export type GetState = () => Object;
export type Thunk = (
  dispatch: Dispatch,
  getState: GetState,
  api: typeof api,
) => void;

export type Store = ReduxStore<any, Action>;
