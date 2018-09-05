// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from './button';
import Panel from './panel';
import SeriesActionsPanel from './collection-series-actions-panel';
import SeriesRow from './series-row';
import type { Bookmark, FeedItem } from '../types';

type Props = {
  collectionSlug: string,
  bookmarks: { [id: string]: Bookmark },
  feedItems: FeedItem[],
};

type State = {
  currentSeriesActionPanelId: ?string,
  showAll: boolean,
};

class Feed extends Component<Props, State> {
  state = {
    currentSeriesActionPanelId: null,
    showAll: false,
  };

  handleSeriesOptionsClick = (id: string) => (e: SyntheticEvent<*>) => {
    this.setState({ currentSeriesActionPanelId: id });
  };

  handleSeriesOptionsPanelClose = () => {
    this.setState({ currentSeriesActionPanelId: null });
  };

  render() {
    const { collectionSlug, bookmarks, feedItems } = this.props;
    const { currentSeriesActionPanelId, showAll } = this.state;

    const unreadFeedItems = feedItems.filter(item => item.isCaughtUp === false);
    const filteredFeedItems = showAll ? feedItems : unreadFeedItems;
    const hiddenItemCount = feedItems.length - filteredFeedItems.length;

    return (
      <div className="pt-3 pt-4-m pb-6 mw-600 mh-auto">
        <Panel
          isShown={Boolean(currentSeriesActionPanelId)}
          onRequestClose={this.handleSeriesOptionsPanelClose}>
          {({ onRequestClose }) => (
            <SeriesActionsPanel
              collectionSlug={collectionSlug}
              seriesId={currentSeriesActionPanelId}
              // $FlowFixMe: `currentSeriesActionPanelId` is guaranteed to exist by the `isShown` prop
              bookmark={bookmarks[currentSeriesActionPanelId]}
              onRequestClose={onRequestClose}
            />
          )}
        </Panel>
        <div className="x xw-wrap">
          {filteredFeedItems.map(item => (
            <SeriesRow
              className="w-50p w-25p-m"
              key={item.series.id}
              collectionSlug={collectionSlug}
              feedItem={item}
              onOptionsClick={this.handleSeriesOptionsClick}
            />
          ))}
        </div>
        <Button onClick={() => this.setState({ showAll: !showAll })}>
          {showAll
            ? `Show ${unreadFeedItems.length} unread series`
            : `Show ${hiddenItemCount} more series`}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { series: seriesById, chapters: chaptersById } = state;
  const { bookmarks } = ownProps;

  const seriesIds = Object.keys(bookmarks);
  const feedItems: FeedItem[] = seriesIds
    .map(seriesId => {
      const { lastReadChapterId, linkTo } = bookmarks[seriesId];

      const series = seriesById[seriesId];
      const chapterIds = series ? series.chapters || [] : [];
      const chapters = chapterIds.map(id => chaptersById[id]);

      return {
        series,
        chapters,
        isCaughtUp: chapters.length > 0 && chapters[0].id === lastReadChapterId,
        lastReadChapterId,
        linkTo,
      };
    })
    // Ignore bookmarks where the series hasn't loaded
    .filter(item => item.series)
    .sort((a, b) => {
      if (a.isCaughtUp !== b.isCaughtUp) {
        return a.isCaughtUp - b.isCaughtUp;
      }
      return a.series.title.localeCompare(b.series.title);
    });

  return { feedItems };
};

export default connect(mapStateToProps)(Feed);
