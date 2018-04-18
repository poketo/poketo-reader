// @flow

import { normalize } from 'normalizr';
import schema from '../schema';
import utils from '../../utils';
import type { SiteId, Id, Slug, Series } from '../../types';
import type { EntityStatus, Thunk, SeriesAction } from '../types';

type State = {
  _status: { [id: Id]: EntityStatus },
  [id: Id]: Series,
};

type Action = SeriesAction;

export function fetchSeriesIfNeeded(siteId: SiteId, slug: Slug): Thunk {
  return (dispatch, getState) => {
    const id = utils.getId(siteId, slug);
    if (shouldFetchSeries(getState(), id)) {
      dispatch(fetchSeries(siteId, slug));
    }
  };
}

function shouldFetchSeries(state: Object, id: Id): boolean {
  const seriesById = state.series;
  const status = seriesById._status[id];

  if (!status) {
    return true;
  }

  switch (status.fetchStatus) {
    case 'fetching':
      return false;
    case 'fetched':
      return !isSeriesUpToDate(state, id);
    default:
      return true;
  }
}

export function isSeriesUpToDate(state: Object, seriesId: Id): boolean {
  const seriesById = state.series;
  const existingSeries = seriesById[seriesId];

  // NOTE: we're assuming right now that if we have the data on the client,
  // it's up-to-date.
  return Boolean(existingSeries);
}

export function fetchSeries(siteId: SiteId, slug: Slug): Thunk {
  return (dispatch, getState, api) => {
    const id = utils.getId(siteId, slug);

    dispatch({
      type: 'SET_SERIES_ENTITY_STATUS',
      payload: { id, status: { fetchStatus: 'fetching', errorCode: null } },
    });

    api
      .fetchSeries(siteId, slug)
      .then(response => {
        const normalized = normalize(response.data, schema.series);
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
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
      return {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
    }
    case 'SET_SERIES_ENTITY_STATUS': {
      return {
        ...state,
        _status: {
          ...state._status,
          [action.payload.id]: {
            ...state._status[action.payload.id],
            ...action.payload.status,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}
