// @flow

import localStorage from '../local-storage';
import type { NavigationAction } from '../types';
import type { HomeTabId } from '../../types';

type Action = NavigationAction;
type State = {
  collectionSlug: ?string,
  lastSeenTab: HomeTabId,
};

const STORAGE_DEFAULT_COLLECTION_KEY = 'defaultCollection';
const STORAGE_LAST_SEEN_TAB_KEY = 'lastSeenTab';

const initialState = {
  collectionSlug: localStorage.getItem(STORAGE_DEFAULT_COLLECTION_KEY),
  lastSeenTab: localStorage.getItem(STORAGE_LAST_SEEN_TAB_KEY) || 'now-reading',
};

export const getCollectionSlug = (state: { navigation: State }) =>
  state.navigation.collectionSlug;

export function setDefaultCollection(slug: string): Action {
  localStorage.setItem(STORAGE_DEFAULT_COLLECTION_KEY, slug);

  if (window.Rollbar) {
    window.Rollbar.configure({
      person: {
        id: slug,
      },
    });
  }

  return { type: 'SET_DEFAULT_COLLECTION', payload: slug };
}

export function clearDefaultCollection(): Action {
  localStorage.removeItem(STORAGE_DEFAULT_COLLECTION_KEY);
  return { type: 'CLEAR_DEFAULT_COLLECTION' };
}

export function getLastSeenTab(state: { navigation: State }) {
  return state.navigation.lastSeenTab;
}

export function setLastSeenTab(tabId: HomeTabId) {
  localStorage.setItem(STORAGE_LAST_SEEN_TAB_KEY, tabId);
  return { type: 'SET_LAST_SEEN_TAB', payload: { tabId } };
}

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'SET_DEFAULT_COLLECTION':
      return { ...state, collectionSlug: action.payload };
    case 'CLEAR_DEFAULT_COLLECTION':
      return { ...state, collectionSlug: null };
    case 'SET_LAST_SEEN_TAB':
      return { ...state, lastSeenTab: action.payload.tabId };
    default:
      return state;
  }
}
