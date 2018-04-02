// @flow

import type { Series } from '../../types';
import type {
  FetchStatusState,
  ThunkAction,
  SetMultipleSeriesAction,
  SetSeriesAction,
  SetSeriesStatusAction,
} from '../types';

type State = {
  _status: FetchStatusState,
  [id: string]: Series,
};

type Action = SetMultipleSeriesAction | SetSeriesAction | SetSeriesStatusAction;

export function fetchSeriesIfNeeded(siteId: string, slug: string): ThunkAction {
  return (dispatch, getState) => {
    if (shouldFetchSeries(getState(), siteId, slug)) {
      dispatch(fetchSeries(siteId, slug));
    }
  };
}

function shouldFetchSeries(state, siteId, slug): boolean {
  const series = state.series;
  const seriesList: Series[] = Object.values(series);

  if (series._status.isFetching) {
    return false;
  }

  const existingSeries = seriesList.find(
    s => s.slug === slug && s.site.id === siteId,
  );

  if (existingSeries) {
    return false;
  }

  return true;
}

export function fetchSeries(siteId: string, slug: string): ThunkAction {
  return (dispatch, getState, api) => {
    dispatch({
      type: 'SET_SERIES_STATUS',
      payload: { isFetching: true, errorMessage: null },
    });

    api
      .fetchSeries(siteId, slug)
      .then(response => {
        dispatch({ type: 'SET_SERIES', payload: response.data });
        dispatch({
          type: 'SET_SERIES_STATUS',
          payload: { isFetching: false, errorMessage: null },
        });
      })
      .catch(err => {
        dispatch({
          type: 'SET_SERIES_STATUS',
          payload: { isFetching: false, errorMessage: err.stack },
        });
      });
  };
}

const initialState = {
  _status: {
    isFetching: false,
    errorMessage: null,
  },
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'SET_SERIES':
      return {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
    case 'SET_MULTIPLE_SERIES':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_SERIES_STATUS':
      return { ...state, _status: { ...state._status, ...action.payload } };
    default:
      return state;
  }
}
