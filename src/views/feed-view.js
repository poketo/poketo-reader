// @flow

import React, { Component } from 'react';
import { Subscribe } from 'unstated';

import CircleLoader from '../components/loader-circle';
import CodeBlock from '../components/code-block';
import EntityContainer from '../containers/entity-container';
import IconAdd from '../components/icon-add';
import IconPoketo from '../components/icon-poketo';
import NewBookmarkPanel from '../components/new-bookmark-panel';
import SeriesRow from '../components/series-row';
import utils from '../utils';

import type { Chapter, Collection, Series } from '../types';

type Props = {
  collectionSlug: string,
  history: any,
  store: any,
};

type State = {
  showingPanel: boolean,
};

class FeedView extends Component<Props, State> {
  state = {
    showingPanel: false,
  };

  componentDidMount() {
    const { collectionSlug, store } = this.props;
    store.fetchCollectionIfNeeded(collectionSlug);
  }

  handleMarkAsReadClick = seriesId => () => {
    const { collectionSlug, store } = this.props;
    const now = utils.getTimestamp();

    store.markSeriesAsRead(collectionSlug, seriesId, now);
  };

  handleSeriesOptionsClick = seriesId => () => {
    const { collectionSlug, store } = this.props;

    console.log('hi');
    if (window.confirm('Do you want to delete this series?')) {
      store.removeBookmarkFromCollection(collectionSlug, seriesId);
    }
  };

  handlePanelRequestClose = () => {
    this.setState({ showingPanel: false });
  };

  handleAddButtonClick = () => {
    this.setState({ showingPanel: true });
  };

  handleSeriesClick = seriesId => e => {
    const { history, collectionSlug, store } = this.props;

    const collection: Collection = store.state.collections[collectionSlug];
    const series: ?Series = store.state.series[seriesId];

    if (series === null || series === undefined) {
      return;
    }

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
    const { showingPanel } = this.state;
    const { collections, collectionsStatus } = store.state;
    const { isFetching, errorMessage } = collectionsStatus;

    if (isFetching) {
      return (
        <div>
          <div className="pv-3 ph-3 ta-center">
            <IconPoketo />
          </div>
          <div className="x xd-column xa-center xj-center p-fixed p-center ta-center">
            <div className="mb-3">
              <CircleLoader />
            </div>
          </div>
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

    const collection = collections[collectionSlug];

    if (collection === null || collection === undefined) {
      return (
        <div>
          Uh oh. Couldn't find the manga collection at {collectionSlug}.
        </div>
      );
    }

    const collectionSeriesIds = Object.keys(collection.bookmarks);
    const series: Array<Series> = collectionSeriesIds
      .map(id => store.state.series[id])
      .sort((a: Series, b: Series) => b.updatedAt - a.updatedAt);

    return (
      <div className="pt-5">
        <header className="Navigation p-fixed t-0 l-0 r-0 z-9 x xa-center xj-spaceBetween fs-14 fs-16-m">
          <div className="pv-3 ph-3">
            <IconPoketo />
          </div>
          <button className="pv-3 ph-3" onClick={this.handleAddButtonClick}>
            <IconAdd />
          </button>
        </header>
        {showingPanel && (
          <NewBookmarkPanel
            collectionSlug={collectionSlug}
            onRequestClose={this.handlePanelRequestClose}
            store={store}
          />
        )}
        <div className="pt-3 ta-center-m">
          {series.map(s => {
            const bookmark = collection.bookmarks[s.id];

            return (
              <SeriesRow
                key={s.id}
                series={s}
                isUnread={s.updatedAt > bookmark.lastReadAt}
                linkToUrl={bookmark.linkToUrl}
                onMarkAsReadClick={this.handleMarkAsReadClick}
                onOptionsClick={this.handleSeriesOptionsClick}
                onSeriesClick={this.handleSeriesClick}
              />
            );
          })}
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
