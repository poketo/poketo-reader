// @flow

import React, { Component } from 'react';
import { css, cx } from 'react-emotion';
import { connect } from 'react-redux';
import Button from './button';
import Icon from './icon';
import SeriesRow from './series-row';
import type { Bookmark, FeedItem } from '../types';

const TextLink = props => (
  <a
    className="fs-14 c-gray3 c-pointer"
    css={`
      border: 1px transparent solid;
      border-radius: 3px;
      padding: 4px 6px 3px;
      user-select: none;
      &:hover {
        border: 1px #e2e2e2 solid;
      }
      &:active {
        border-color: transparent;
        background: #f2f2f2;
      }
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
          <h1 className="c-green fs-20 fs-24-m fw-semibold x xa-center">
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
              ? `Hide read series`
              : `Show ${readFeedItems.length} read series`}
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
