// @flow

import { normalize } from 'normalizr';
import schema from '../schema';
import type { Series } from '../../types';
import type {
  FetchStatusState,
  ThunkAction,
  AddEntitiesAction,
  SetMultipleSeriesAction,
  SetSeriesAction,
  SetSeriesStatusAction,
} from '../types';

type State = {
  _status: FetchStatusState,
  [id: string]: Series,
};

type Action =
  | AddEntitiesAction
  | SetMultipleSeriesAction
  | SetSeriesAction
  | SetSeriesStatusAction;

export function fetchSeriesIfNeeded(siteId: string, slug: string): ThunkAction {
  return (dispatch, getState) => {
    if (shouldFetchSeries(getState(), siteId, slug)) {
      dispatch(fetchSeries(siteId, slug));
    }
  };
}

function shouldFetchSeries(state, siteId, slug): boolean {
  const seriesById = state.series;

  if (seriesById._status.isFetching) {
    return false;
  }

  const seriesId = [siteId, slug].join(':');
  const existingSeries = seriesById[seriesId];

  if (existingSeries) {
    return false;
  }

  return true;
}

export function fetchSeries(siteId: string, slug: string): ThunkAction {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_SERIES_STATUS',
      payload: { isFetching: true, errorCode: null },
    });

    api
      .fetchSeries(siteId, slug)
      .then(response => {
        const normalized = normalize(response.data, schema.series);
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
        dispatch({
          type: 'SET_SERIES_STATUS',
          payload: { isFetching: false, errorCode: null },
        });
      })
      .catch(err => {
        dispatch({
          type: 'SET_SERIES_STATUS',
          payload: { isFetching: false, errorCode: 'UNKNOWN_ERROR' },
        });
      });
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
      const seriesById = action.payload.series;
      if (!seriesById) {
        return state;
      }
      const nextState = { ...state };
      Object.keys(seriesById).forEach(id => {
        nextState[id] = {
          ...nextState[id],
          ...seriesById[id],
        };
      });
      return nextState;
    }
    case 'SET_SERIES': {
      return {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
    }
    case 'SET_SERIES_STATUS': {
      return { ...state, _status: { ...state._status, ...action.payload } };
    }
    default: {
      return state;
    }
  }
}
