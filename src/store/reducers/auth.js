// @flow

import type { AuthAction } from '../types';

type Action = AuthAction;
type State = {
  collectionSlug: ?string,
};

const STORAGE_DEFAULT_COLLECTION_KEY = 'defaultCollection';

const initialState = {
  collectionSlug: localStorage.getItem(STORAGE_DEFAULT_COLLECTION_KEY),
};

export function setDefaultCollection(slug: string): Action {
  localStorage.setItem(STORAGE_DEFAULT_COLLECTION_KEY, slug);
  return { type: 'SET_DEFAULT_COLLECTION', payload: slug };
}

export function clearDefaultCollection(): Action {
  localStorage.removeItem(STORAGE_DEFAULT_COLLECTION_KEY);
  return { type: 'CLEAR_DEFAULT_COLLECTION' };
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
    default:
      return state;
  }
}
