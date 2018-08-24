// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
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
};

class Feed extends Component<Props, State> {
  state = {
    currentSeriesActionPanelId: null,
  };

  handleSeriesOptionsClick = (id: string) => (e: SyntheticEvent<*>) => {
    this.setState({ currentSeriesActionPanelId: id });
  };

  handleSeriesOptionsPanelClose = () => {
    this.setState({ currentSeriesActionPanelId: null });
  };

  render() {
    const { collectionSlug, bookmarks, feedItems } = this.props;
    const { currentSeriesActionPanelId } = this.state;

    return (
      <div className="pt-3 ta-center-m">
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
        {feedItems.map(item => (
          <SeriesRow
            key={item.series.id}
            collectionSlug={collectionSlug}
            feedItem={item}
            onOptionsClick={this.handleSeriesOptionsClick}
          />
        ))}
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
      const series = seriesById[seriesId];

      return {
        series,
        chapters: series.chapters
          ? series.chapters.map(id => chaptersById[id])
          : [],
        lastReadAt: bookmarks[seriesId].lastReadAt,
        linkTo: bookmarks[seriesId].linkTo,
      };
    })
    // Ignore bookmarks where the series hasn't loaded
    .filter(item => item.series)
    .sort((a, b) => b.series.updatedAt - a.series.updatedAt);

  return { feedItems };
};

export default connect(mapStateToProps)(Feed);
