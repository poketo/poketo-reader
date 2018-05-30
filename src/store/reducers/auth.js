// @flow

import type { AuthAction } from '../types';

type Action = AuthAction;
type State = {
  collectionSlug: ?string,
};

const initialState = {
  collectionSlug: null,
};

export function setDefaultCollection(slug: string): Action {
  return { type: 'SET_DEFAULT_COLLECTION', payload: slug };
}

export function clearDefaultCollection(): Action {
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
