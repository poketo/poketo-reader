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
      <div className="pt-3 pt-4-m mw-600 mh-auto">
        <header className="ph-3 mb-3">
          <h1 className="fs-24 fw-semibold">Library</h1>
        </header>
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
          {feedItems.map(item => (
            <SeriesRow
              className="w-50p w-25p-m"
              key={item.series.id}
              collectionSlug={collectionSlug}
              feedItem={item}
              onOptionsClick={this.handleSeriesOptionsClick}
            />
          ))}
        </div>
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
      const chapters = series ? series.chapters || [] : [];

      return {
        series,
        chapters: chapters.map(id => chaptersById[id]),
        lastReadAt: bookmarks[seriesId].lastReadAt,
        linkTo: bookmarks[seriesId].linkTo,
      };
    })
    // Ignore bookmarks where the series hasn't loaded
    .filter(item => item.series)
    .sort((a, b) => a.series.title.localeCompare(b.series.title));

  return { feedItems };
};

export default connect(mapStateToProps)(Feed);
