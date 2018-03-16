// @flow

import React, { Component } from 'react';
import { Subscribe } from 'unstated';

import poketoMarkUrl from '../assets/poketo-mark.svg';

import CircleLoader from '../components/loader-circle';
import CodeBlock from '../components/code-block';
import EntityContainer from '../containers/entity-container';
import IconAdd from '../components/icon-add';
import SeriesRow from '../components/series-row';
import utils from '../utils';

import type { Chapter, Collection, Series } from '../types';

type Props = {
  collectionSlug: string,
  history: any,
  store: any,
};

class FeedView extends Component<Props> {
  componentDidMount() {
    const { collectionSlug, store } = this.props;
    store.fetchCollectionIfNeeded(collectionSlug);
  }

  handleMarkAsReadClick = seriesId => () => {
    const { collectionSlug, store } = this.props;
    const { series } = store.state;

    const seriesSlug = series[seriesId].slug;

    store.markSeriesAsRead(collectionSlug, seriesSlug);
  };

  handleSeriesClick = seriesId => e => {
    const { history, collectionSlug, store } = this.props;

    const collection: Collection = store.state.collections[collectionSlug];
    const series: ?Series = store.state.series[seriesId];

    if (series === null || series === undefined) {
      return;
    }

    store.markSeriesAsRead(collectionSlug, series.slug);

    if (series.supportsReading !== true || series.chapters === undefined) {
      return;
    }

    e.preventDefault();

    const unreadChapters: Array<Chapter> = series.chapters.filter(
      chapter => chapter.createdAt > collection.bookmarks[series.id].lastReadAt,
    );

    const toChapter =
      unreadChapters.length > 0
        ? utils.leastRecentChapter(unreadChapters)
        : utils.mostRecentChapter(series.chapters);

    history.push(
      utils.getReaderUrl(
        collectionSlug,
        series.site.id,
        series.slug,
        toChapter.slug,
      ),
    );
  };

  render() {
    const { store, collectionSlug } = this.props;
    const { collections, collectionsStatus } = store.state;
    const { isFetching, errorMessage } = collectionsStatus;

    const collection = collections[collectionSlug];
    const series: Array<Series> = Object.values(store.state.series).sort(
      (a: Series, b: Series) => b.updatedAt - a.updatedAt,
    );

    if (isFetching) {
      return (
        <div>
          <div className="pv-3 ph-3 ta-center">
            <img src={poketoMarkUrl} alt="Poketo" />
          </div>
          <div className="x xd-column xa-center xj-center pa-4 ta-center h-100vh">
            <div className="mb-3">
              <CircleLoader />
            </div>
            <span className="fs-12 o-50p">Loading bookmarks</span>
          </div>
        </div>
      );
    }

    if (
      (isFetching === false &&
        (collection === null || collection === undefined)) ||
      series.length === 0
    ) {
      return (
        <div>
          Uh oh. Couldn't find the manga collection at {collectionSlug}.
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div>
          Something went wrong while loading.
          <CodeBlock>{errorMessage}</CodeBlock>
        </div>
      );
    }

    return (
      <div className="pt-5">
        <header className="Navigation p-fixed t-0 l-0 r-0 z-9 x xa-center xj-spaceBetween fs-14 fs-16-m">
          <div className="pv-3 ph-3">
            <img src={poketoMarkUrl} alt="Poketo" />
          </div>
          <button className="pv-3 ph-3">
            <IconAdd />
          </button>
        </header>
        <div className="pt-3 mw-500">
          {series.map(s => (
            <div key={s.id} className="mb-3">
              <SeriesRow
                series={s}
                isUnread={s.updatedAt > collection.bookmarks[s.id].lastReadAt}
                linkTo={collection.bookmarks[s.id].linkTo}
                onMarkAsReadClick={this.handleMarkAsReadClick}
                onSeriesClick={this.handleSeriesClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ({ match, history }: any) => (
  <Subscribe to={[EntityContainer]}>
    {store => (
      <FeedView
        collectionSlug={match.params.collectionSlug}
        store={store}
        history={history}
      />
    )}
  </Subscribe>
);
