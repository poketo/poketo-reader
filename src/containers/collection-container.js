// @flow

import { Container } from 'unstated';
import utils from '../utils';

import type { Collection, Series } from '../types';

type State = {
  collections: { [slug: string]: Collection },
  errorMessage: ?string,
  isError: boolean,
  isFetching: boolean,
  isNotFound: boolean,
  lastFetched: number,
  series: { [id: string]: Series },
};

const getSeriesProps = ({ lastReadAt, linkTo, ...rest }) => rest;

const getCollectionProps = ({ id, lastReadAt, linkTo }) => ({
  id,
  lastReadAt,
  linkTo,
});

export default class CollectionContainer extends Container<State> {
  state = {
    collections: {},
    isError: false,
    isFetching: false,
    isNotFound: false,
    lastFetched: 0,
    errorMessage: null,
    series: {},
  };

  fetchCollectionIfNeeded = (collectionSlug: string) => {
    const existingCollection = this.state.collections[collectionSlug];

    // Don't fetch twice. Most basic caching mechanism.
    if (existingCollection !== null && existingCollection !== undefined) {
      return;
    }

    this.fetchCollection(collectionSlug);
  };

  fetchCollection = (collectionSlug: string) => {
    this.setState({ isFetching: true });

    utils
      .fetchCollection(collectionSlug)
      .then(response => {
        const unnormalized = response.data;
        const series = utils.keyArrayBy(
          unnormalized.map(getSeriesProps),
          obj => obj.id,
        );
        const collectionSeries = utils.keyArrayBy(
          unnormalized.map(getCollectionProps),
          obj => obj.id,
        );

        const collections = {
          ...this.state.collections,
          [collectionSlug]: {
            slug: collectionSlug,
            series: collectionSeries,
          },
        };

        this.setState({
          collections,
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
    // TODO: this is a weird consequence of the half-way between slugs and IDs. We should
    // just be using IDs here, but we're not sending them back from the server.
    const series: Series = Object.values(this.state.series).find(
      (srs: Series) => srs.slug === seriesSlug,
    );

    const collection = this.state.collections[collectionSlug];
    const collectionSeries = collection.series[series.id];

    this.setState({
      collections: {
        ...this.state.collections,
        [collectionSlug]: {
          ...collection,
          series: {
            ...collection.series,
            [series.id]: {
              ...collectionSeries,
              lastReadAt: Math.round(Date.now() / 1000),
            },
          },
        },
      },
    });

    // We don't handle the response since we pass this info optimistically.
    utils.fetchMarkAsRead(collectionSlug, seriesSlug).catch(err => {
      this.setState({ errorMessage: err.stack });
    });
  };
}
