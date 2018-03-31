// @flow

import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { type RouterHistory } from 'react-router-dom';
import { Subscribe } from 'unstated';

import CircleLoader from '../components/loader-circle';
import CodeBlock from '../components/code-block';
import EntityContainer from '../containers/entity-container';
import IconAdd from '../components/icon-add';
import IconBook from '../components/icon-book';
import IconFeed from '../components/icon-feed';
import IconPoketo from '../components/icon-poketo';
import IconTrash from '../components/icon-trash';
import NewBookmarkPanel from '../components/new-bookmark-panel';
import Panel from '../components/panel';
import SeriesRow from '../components/series-row';
import utils from '../utils';

import type { Bookmark, Collection, Series } from '../types';

type Props = {
  collectionSlug: string,
  history: RouterHistory,
  store: EntityContainer,
};

type State = {
  showNewBookmarkPanel: boolean,
  seriesOptionsPanelId: ?string,
};

class FeedView extends Component<Props, State> {
  state = {
    showNewBookmarkPanel: false,
    seriesOptionsPanelId: null,
  };

  componentDidMount() {
    const { collectionSlug, store } = this.props;
    store.fetchCollectionIfNeeded(collectionSlug);
  }

  handleSeriesOptionsClick = seriesId => () => {
    this.setState({ seriesOptionsPanelId: seriesId });
  };

  handleSeriesOptionsTrashClick = () => {
    const { collectionSlug, store } = this.props;
    const { seriesOptionsPanelId } = this.state;

    if (!seriesOptionsPanelId) {
      return;
    }

    if (window.confirm('Do you want to delete this series?')) {
      store.removeBookmarkFromCollection(collectionSlug, seriesOptionsPanelId);
      this.handleSeriesOptionsPanelClose();
    }
  };

  handleSeriesOptionsMarkAsReadClick = () => {
    const { collectionSlug, store } = this.props;
    const { seriesOptionsPanelId } = this.state;

    if (!seriesOptionsPanelId) {
      return;
    }

    const now = utils.getTimestamp();

    store.markSeriesAsRead(collectionSlug, seriesOptionsPanelId, now);

    this.handleSeriesOptionsPanelClose();
  };

  handleNewBookmarkPanelClose = () => {
    this.setState({ showNewBookmarkPanel: false });
  };

  handleSeriesOptionsPanelClose = () => {
    this.setState({ seriesOptionsPanelId: null });
  };

  handleAddButtonClick = () => {
    this.setState({ showNewBookmarkPanel: true });
  };

  handleSeriesClick = seriesId => e => {
    const { history, collectionSlug, store } = this.props;

    const collection: ?Collection = store.state.collections[collectionSlug];
    const series: ?Series = store.state.series[seriesId];

    if (
      !collection ||
      !series ||
      !series.chapters ||
      series.supportsReading === false
    ) {
      return;
    }

    e.preventDefault();

    const bookmark = collection.bookmarks[series.id];
    const unreadChapters = utils.getUnreadChapters(
      series.chapters,
      bookmark.lastReadAt,
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

  renderSeriesPanel() {
    const { store, collectionSlug } = this.props;
    const { seriesOptionsPanelId } = this.state;

    if (!seriesOptionsPanelId) {
      return null;
    }

    const collection: Collection = store.state.collections[collectionSlug];
    const series: ?Series = store.state.series[seriesOptionsPanelId];
    const bookmark: ?Bookmark = collection.bookmarks[seriesOptionsPanelId];

    if (!series || !bookmark) {
      return null;
    }

    const showMarkAsRead =
      seriesOptionsPanelId && series.updatedAt > bookmark.lastReadAt;

    let unreadChapters = [];

    if (showMarkAsRead && series && series.chapters && bookmark) {
      unreadChapters = utils.getUnreadChapters(
        series.chapters,
        bookmark.lastReadAt,
      );
    }

    return (
      <Panel.Transition>
        <Panel onRequestClose={this.handleSeriesOptionsPanelClose}>
          {showMarkAsRead && (
            <Panel.Button
              icon={<IconBook />}
              label={
                series.supportsReading === true
                  ? `Mark ${unreadChapters.length} chapters as read`
                  : `Mark series as read`
              }
              onClick={() => {}}
            />
          )}
          <Panel.Button
            icon={<IconFeed color="#ff992f" />}
            label="Get RSS feed"
            onClick={this.handleSeriesOptionsMarkAsReadClick}
          />
          <Panel.Button
            icon={<IconTrash color="red" />}
            label="Remove bookmark"
            onClick={this.handleSeriesOptionsTrashClick}
          />
        </Panel>
      </Panel.Transition>
    );
  }

  renderNewBookmarkPanel() {
    const { store, collectionSlug } = this.props;
    const { showNewBookmarkPanel } = this.state;

    if (!showNewBookmarkPanel) {
      return null;
    }

    return (
      <Panel.Transition>
        <NewBookmarkPanel
          collectionSlug={collectionSlug}
          onRequestClose={this.handleNewBookmarkPanelClose}
          store={store}
        />
      </Panel.Transition>
    );
  }

  render() {
    const { store, collectionSlug } = this.props;
    const { collections, collectionsStatus } = store.state;
    const { isFetching, errorMessage } = collectionsStatus;

    if (isFetching) {
      return (
        <div>
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
        <div className="pa-3">
          Something went wrong while loading.
          <CodeBlock>{errorMessage}</CodeBlock>
        </div>
      );
    }

    const collection = collections[collectionSlug];

    if (!collection) {
      return (
        <div className="pa-3">
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
        <TransitionGroup>
          {this.renderSeriesPanel()}
          {this.renderNewBookmarkPanel()}
        </TransitionGroup>
        <div className="pt-3 ta-center-m">
          {series.map(s => {
            const bookmark = collection.bookmarks[s.id];

            return (
              <SeriesRow
                key={s.id}
                series={s}
                isUnread={s.updatedAt > bookmark.lastReadAt}
                linkTo={bookmark.linkTo}
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
