// @flow

import { normalize } from 'normalizr';
import schema from '../schema';
import utils from '../../utils';
import type { Series } from 'poketo';
import type { EntityStatus, Thunk, SeriesAction } from '../types';

type State = {
  _status: { [id: string]: EntityStatus },
  [id: string]: Series,
};

type Action = SeriesAction;

export function fetchSeriesIfNeeded(seriesId: string): Thunk {
  return (dispatch, getState) => {
    if (shouldFetchSeries(getState(), seriesId)) {
      dispatch(fetchSeries(seriesId));
    }
  };
}

const STALE_AFTER = 7200; // 2 hours in seconds

export function shouldFetchSeries(state: Object, seriesId: string): boolean {
  const seriesById = state.series;
  const status = seriesById._status[seriesId];

  switch (status && status.fetchStatus) {
    case 'fetching':
      return false;
    case 'fetched':
      const isStale = utils.getTimestamp() - status.lastFetchedAt > STALE_AFTER;
      return status.didInvalidate || isStale;
    default:
      return true;
  }
}

export function fetchSeries(id: string): Thunk {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_SERIES_ENTITY_STATUS',
      payload: { id, status: { fetchStatus: 'fetching', errorCode: null } },
    });

    api
      .fetchSeries(id)
      .then(response => {
        const normalized = normalize(response.data, schema.series);
        dispatch({
          type: 'SET_SERIES_ENTITY_STATUS',
          payload: {
            id,
            status: {
              fetchStatus: 'fetched',
              errorCode: null,
              lastFetchedAt: utils.getTimestamp(),
            },
          },
        });
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
      })
      .catch(err => {
        dispatch({
          type: 'SET_SERIES_ENTITY_STATUS',
          payload: {
            id,
            status: { fetchStatus: 'error', errorCode: 'UNKNOWN_ERROR' },
          },
        });
      });
  };
}

const initialState = {
  _status: {},
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
      return utils.set(state, action.payload.id, prev => ({
        ...prev,
        ...action.payload,
      }));
    }
    case 'SET_SERIES_ENTITY_STATUS': {
      const { id, status } = action.payload;

      return utils.set(state, `_status.${id}`, prev => ({
        ...prev,
        ...status,
      }));
    }
    default: {
      return state;
    }
  }
}
