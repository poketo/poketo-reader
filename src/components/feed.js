// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cx } from 'react-emotion';
import NextChapterRow from './next-chapter-row';
import SeriesRow from './series-row';
import PassiveButton from './passive-button';
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

  render() {
    const { collectionSlug, feedItems } = this.props;
    const { showAll } = this.state;

    const unreadFeedItems = feedItems.filter(item => item.isCaughtUp === false);
    const readFeedItems = feedItems.filter(item => item.isCaughtUp === true);

    return (
      <div className="pt-4 ph-2 pb-6 mw-600 mh-auto">
        <div className="mb-4">
          {unreadFeedItems.map((item, index) => (
            <div
              key={item.series.id}
              className={cx('pb-2 mb-2', {
                'bb-1 bc-gray1': index !== unreadFeedItems.length - 1,
              })}>
              <NextChapterRow collectionSlug={collectionSlug} feedItem={item} />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <PassiveButton onClick={() => this.setState({ showAll: !showAll })}>
            {showAll
              ? `Hide caught-up series`
              : `Show ${readFeedItems.length} caught-up series`}
          </PassiveButton>
        </div>
        {showAll && (
          <div>
            {readFeedItems.map(item => (
              <SeriesRow
                key={item.series.id}
                collectionSlug={collectionSlug}
                feedItem={item}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { series: seriesById, chapters: chaptersById } = state;
  const { bookmarks } = ownProps;

  const newReleases = ['mangadex:15941:8998', 'mangadex:7645:445924'];
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
        isCaughtUp:
          chapters.length > 0 ? chapters[0].id === lastReadChapterId : true,
        isNewRelease: chapterIds.some(id => newReleases.includes(id)),
        lastReadChapterId,
        linkTo,
      };
    })
    // Ignore bookmarks where the series hasn't loaded
    .filter(item => item.series)
    .sort((a, b) => {
      if (a.isCaughtUp !== b.isCaughtUp) {
        return Number(a.isCaughtUp) - Number(b.isCaughtUp);
      }
      if (a.isNewRelease !== b.isNewRelease) {
        return Number(b.isNewRelease) - Number(a.isNewRelease);
      }
      return a.series.title.localeCompare(b.series.title);
    });

  return { feedItems };
};

export default connect(mapStateToProps)(Feed);
