// @flow

import { Container } from 'unstated';
import utils from '../utils';

import type { Series } from '../types';

type SeriesState = {
  series: { [id: string]: Series },
  errorMessage: ?string,
  isError: boolean,
  isFetching: boolean,
  isNotFound: boolean,
  lastFetched: number,
};

export default class SeriesContainer extends Container<SeriesState> {
  state = {
    series: {},
    isError: false,
    isFetching: false,
    isNotFound: false,
    lastFetched: 0,
    errorMessage: null,
  };

  fetchCollection = (collectionSlug: string) => {
    // Don't fetch twice. Most basic caching mechanism.
    if (this.state.lastFetched > 0) {
      return;
    }

    this.setState({ isFetching: true });

    utils
      .fetchCollection(collectionSlug)
      .then(response => {
        const series = utils.keyArrayBy(response.data, obj => obj.id);

        this.setState({
          series,
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

  addSeriesToCollection = (collectionSlug: string, seriesUrl: string) => {
    utils.addSeries(collectionSlug, seriesUrl).then(response => {
      const newSeries = response.data;

      this.setState({
        series: {
          ...this.state.series,
          [newSeries.id]: {
            ...this.state.series[newSeries.id],
            ...newSeries,
          },
        },
      });
    });
  };

  markSeriesAsRead = (collectionSlug: string, seriesSlug: string) => {
    utils
      .fetchMarkAsRead(collectionSlug, seriesSlug)
      .then(response => {
        const newSeries = response.data;
        // TODO: this is a weird consequence of the half-way between slugs and IDs. We should
        // just be using IDs here, but we're not sending them back from the server.
        const oldSeries: Series = Object.values(this.state.series).find(
          (srs: Series) => srs.slug === newSeries.slug,
        );

        this.setState({
          series: {
            ...this.state.series,
            [oldSeries.id]: {
              ...oldSeries,
              ...newSeries,
            },
          },
        });
      })
      .catch(err => {
        this.setState({ errorMessage: err.stack });
      });
  };
}
