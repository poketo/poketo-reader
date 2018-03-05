// @flow

import { Container } from 'unstated';
import utils from '../utils';

import type { Series } from '../types';

type SeriesState = {
  series: Array<Series>,
  errorMessage: ?string,
  isError: boolean,
  isFetching: boolean,
  isNotFound: boolean,
  lastFetched: number,
};

export default class SeriesContainer extends Container<SeriesState> {
  state = {
    series: [],
    isError: false,
    isFetching: false,
    isNotFound: false,
    lastFetched: 0,
    errorMessage: null,
  };

  fetchCollection = (collectionId: string) => {
    // Don't fetch twice. Most basic caching mechanism.
    if (this.state.lastFetched > 0) {
      return;
    }

    this.setState({ isFetching: true });

    utils
      .fetchCollection(collectionId)
      .then(response => {
        this.setState({
          series: response.data,
          isFetching: false,
          lastFetched: Date.now(),
        });
      })
      .catch(err => {
        this.setState({
          isFetching: false,
          isNotFound: err.status === 404,
          isError: err.status !== 404,
          errorMessage: err.stack,
        });
      });
  };

  fetchChapter = (
    collectionId: string,
    seriesId: string,
    chapterId: string,
  ) => {
    // TODO
  };

  addSeriesToCollection = (collectionId: string, seriesUrl: string) => {
    utils.addSeries(collectionId, seriesUrl).then(response => {
      const series = this.state.series.map(srs => {
        if (srs.slug === response.data.slug) {
          return { ...srs, ...response.data };
        }
        return srs;
      });

      this.setState({ series });
    });
  };

  markSeriesAsRead = (collectionId: string, seriesId: string) => {
    utils
      .fetchMarkAsRead(collectionId, seriesId)
      .then(response => {
        const series = this.state.series.map(srs => {
          if (srs.slug === response.data.slug) {
            return { ...srs, ...response.data };
          }
          return srs;
        });

        this.setState({ series, isFetching: false });
      })
      .catch(err => {
        this.setState({ errorMessage: err.stack });
      });
  };
}
