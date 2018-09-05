// @flow

import React, { Component } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { type RouterHistory } from 'react-router';
import { connect } from 'react-redux';

import FeedHeader from '../components/feed-header';
import Icon from '../components/icon';
import NewBookmarkPanel from '../containers/new-bookmark-panel';
import Panel from '../components/panel';
import SeriesRow from '../components/series-row';
import Toast from '../components/toast';
import utils from '../utils';
import {
  removeBookmark,
  markSeriesAsRead,
  fetchSeriesForCollection,
} from '../store/reducers/collections';
import { setDefaultCollection } from '../store/reducers/auth';

import type {
  Bookmark,
  Chapter,
  ChapterMetadata,
  Collection,
  Series,
} from '../types';
import type { Dispatch } from '../store/types';

type Props = {
  dispatch: Dispatch,
  history: RouterHistory,
  collection: Collection,
  chaptersById: { [id: string]: Chapter | ChapterMetadata },
  seriesById: { [id: string]: Series },
};

type State = {
  showNewBookmarkPanel: boolean,
  optionsPanelSeriesId: ?string,
};

class Feed extends Component<Props, State> {
  state = {
    showNewBookmarkPanel: false,
    optionsPanelSeriesId: null,
  };

  static mapStateToProps = state => ({
    chaptersById: state.chapters,
    seriesById: state.series,
  });

  componentDidMount() {
    const { dispatch, collection } = this.props;
    dispatch(fetchSeriesForCollection(collection.slug));
    dispatch(setDefaultCollection(collection.slug));
  }

  componentDidUpdate(nextProps) {
    if (nextProps.collection.slug !== this.props.collection.slug) {
      nextProps.dispatch(fetchSeriesForCollection(nextProps.collection.slug));
    }
  }

  handleSeriesOptionsClick = seriesId => () => {
    this.setState({ optionsPanelSeriesId: seriesId });
  };

  handleSeriesOptionsRemoveClick = () => {
    const { collection, dispatch } = this.props;
    const { optionsPanelSeriesId } = this.state;

    if (!collection || !optionsPanelSeriesId) {
      return;
    }

    if (window.confirm('Do you want to remove this series?')) {
      dispatch(removeBookmark(collection.slug, optionsPanelSeriesId));
      this.handleSeriesOptionsPanelClose();
    }
  };

  handleSeriesOptionsMarkAsReadClick = () => {
    const { collection, dispatch, seriesById, chaptersById } = this.props;
    const { optionsPanelSeriesId } = this.state;

    if (!optionsPanelSeriesId) {
      return;
    }

    const series: ?Series = seriesById[optionsPanelSeriesId];

    if (!series) {
      return;
    }

    let lastReadChapterId = null;

    if (series.chapters && series.chapters.length > 0) {
      const allChapters = series.chapters.map(id => chaptersById[id]);
      const sortedChapters = utils.sortChapters(allChapters);
      lastReadChapterId = sortedChapters[0].id;
    }

    dispatch(
      markSeriesAsRead(
        collection.slug,
        optionsPanelSeriesId,
        lastReadChapterId,
      ),
    );

    this.handleSeriesOptionsPanelClose();
  };

  handleNewBookmarkPanelClose = () => {
    this.setState({ showNewBookmarkPanel: false });
  };

  handleSeriesOptionsPanelClose = () => {
    this.setState({ optionsPanelSeriesId: null });
  };

  handleAddButtonClick = () => {
    this.setState({ showNewBookmarkPanel: true });
  };

  handleSeriesClick = seriesId => e => {
    const { history, collection, seriesById, chaptersById } = this.props;

    const series: ?Series = seriesById[seriesId];

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
    const allChapters = series.chapters.map(id => chaptersById[id]);
    const toChapter = utils.nextChapterToRead(
      allChapters,
      bookmark.lastReadChapterId,
    );

    history.push(utils.getReaderUrl(collection.slug, toChapter.id));
  };

  isSeriesUnread = (seriesId, lastReadChapterId: string | null): boolean => {
    const { chaptersById, seriesById } = this.props;

    const series = seriesById[seriesId];

    if (!series) {
      return false;
    }

    if (!series.chapters) {
      return false;
    }

    const chapters = series.chapters.map(chapterId => chaptersById[chapterId]);
    const unreadChapters = utils.getUnreadChapters(chapters, lastReadChapterId);

    return unreadChapters.length > 0;
  };

  renderSeriesPanel() {
    const { collection, chaptersById, seriesById } = this.props;
    const { optionsPanelSeriesId } = this.state;

    if (!optionsPanelSeriesId || !collection) {
      return null;
    }

    const series: ?Series = seriesById[optionsPanelSeriesId];
    const bookmark: ?Bookmark = collection.bookmarks[optionsPanelSeriesId];

    if (!series || !bookmark) {
      return null;
    }

    const unreadChapters = series.chapters
      ? utils.getUnreadChapters(
          series.chapters.map(id => chaptersById[id]),
          bookmark.lastReadChapterId,
        )
      : [];

    const showMarkAsRead = unreadChapters.length > 0;

    return (
      <Panel.Transition>
        <Panel onRequestClose={this.handleSeriesOptionsPanelClose}>
          <Panel.Link
            icon={<Icon name="new-tab" iconSize={20} />}
            label={`Open on ${series.site.name}`}
            target="_blank"
            rel="noopener noreferrer"
            href={series.url}
          />
          {showMarkAsRead && (
            <Panel.Button
              icon={<Icon name="book" iconSize={20} />}
              label={
                series.supportsReading === true
                  ? `Mark ${unreadChapters.length} chapter${
                      unreadChapters.length === 1 ? '' : 's'
                    } as read`
                  : `Mark series as read`
              }
              onClick={this.handleSeriesOptionsMarkAsReadClick}
            />
          )}
          <Panel.Button
            icon={<Icon name="trash" iconSize={20} className="c-coral" />}
            label="Remove series"
            onClick={this.handleSeriesOptionsRemoveClick}
          />
        </Panel>
      </Panel.Transition>
    );
  }

  renderNewBookmarkPanel() {
    const { collection } = this.props;
    const { showNewBookmarkPanel } = this.state;

    if (!showNewBookmarkPanel) {
      return null;
    }

    return (
      <Panel.Transition>
        <NewBookmarkPanel
          collectionSlug={collection.slug}
          onRequestClose={this.handleNewBookmarkPanelClose}
        />
      </Panel.Transition>
    );
  }

  render() {
    const { collection, seriesById } = this.props;
    const { bookmarks } = collection;

    const seriesIds = Object.keys(bookmarks);
    const statuses = seriesIds
      .map(id => seriesById._status[id])
      .filter(Boolean);

    const isFetching = statuses.some(
      status => status.fetchStatus === 'fetching',
    );

    const feedItems = seriesIds
      .map(seriesId => ({
        series: seriesById[seriesId],
        lastReadChapterId: bookmarks[seriesId].lastReadChapterId,
        linkTo: bookmarks[seriesId].linkTo,
      }))
      .filter(item => item.series)
      .sort((a, b) => b.series.updatedAt - a.series.updatedAt);

    return (
      <div className="pt-5 pb-6">
        <FeedHeader onAddButtonClick={this.handleAddButtonClick} />
        <TransitionGroup>
          {this.renderSeriesPanel()}
          {this.renderNewBookmarkPanel()}
        </TransitionGroup>
        <div className="pt-3 ta-center-m">
          <div className="p-fixed t-0 l-0 r-0 z-9 mt-4 pt-2 ph-3 pe-none">
            <Toast isShown={isFetching}>Syncing...</Toast>
          </div>
          {feedItems.map(item => (
            <SeriesRow
              key={item.series.id}
              series={item.series}
              isUnread={this.isSeriesUnread(
                item.series.id,
                item.lastReadChapterId,
              )}
              linkTo={item.linkTo}
              onOptionsClick={this.handleSeriesOptionsClick}
              onSeriesClick={this.handleSeriesClick}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(Feed.mapStateToProps)(Feed);
