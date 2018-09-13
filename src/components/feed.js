// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from './icon';
import SeriesRow from './series-row';
import type { Bookmark, FeedItem } from '../types';

const TextLink = props => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a
    className="fs-14 c-gray3 c-pointer hover-bg "
    css={`
      border: 1px transparent solid;
      border-radius: 3px;
      padding: 4px 6px 3px;
      user-select: none;
    `}
    {...props}
  />
);

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
      <div className="pt-5 ph-3 pb-6 mw-600 mh-auto">
        <header className="mb-3 ph-2">
          <h1 className="fs-20 fw-semibold x xa-center">
            <Icon name="book" className="c-lightGreen mr-3" /> Reading
          </h1>
        </header>
        <div className="mb-4">
          {unreadFeedItems.map(item => (
            <SeriesRow
              key={item.series.id}
              collectionSlug={collectionSlug}
              feedItem={item}
            />
          ))}
        </div>
        <div className="mb-4">
          <TextLink onClick={() => this.setState({ showAll: !showAll })}>
            {showAll
              ? `Hide caught-up series`
              : `Show ${readFeedItems.length} caught-up series`}
          </TextLink>
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
        return Number(a.isCaughtUp) - Number(b.isCaughtUp);
      }
      return a.series.title.localeCompare(b.series.title);
    });

  return { feedItems };
};

export default connect(mapStateToProps)(Feed);
