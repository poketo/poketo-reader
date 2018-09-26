// @flow

import React, { Component } from 'react';
import { cx, css } from 'react-emotion';
import { connect } from 'react-redux';
import { Route, NavLink, withRouter } from 'react-router-dom';
import FeedItemRow from './feed-item-row';
import SeriesRow from './series-row';
import Icon from './icon';
import type { Bookmark, FeedItem } from '../types';

const nextChapterDivider = css`
  & + & {
    border-top: 1px #f2f2f2 solid;
  }
`;

const CollectionNavigation = ({ collectionSlug }) => (
  <header className="x ph-2 mb-4 fw-semibold ta-center ta-left-m">
    <NavLink
      to={`/c/${collectionSlug}`}
      exact
      className="x xd-row-m  br-4 pv-2 ph-1 xa-center xj-center"
      css="flex-basis: 100%;"
      activeClassName="bgc-extraFadedLightCoral c-coral">
      <Icon name="bookmark" className="mr-1 mr-2-m" />
      Now Reading
    </NavLink>
    <NavLink
      to={`/c/${collectionSlug}/library`}
      css="flex-basis: 100%;"
      exact
      className="x br-4 xd-row-m pv-2 ph-1 xa-center xj-center"
      activeClassName="bgc-extraFadedLightCoral c-coral">
      <Icon name="book" className="mr-1 mr-2-m" />
      Library
    </NavLink>
  </header>
);

type Props = {
  collectionSlug: string,
  bookmarks: { [id: string]: Bookmark },
  feedItems: FeedItem[],
};

class Feed extends Component<Props> {
  render() {
    const { collectionSlug, feedItems } = this.props;

    const unreadFeedItems = feedItems
      .filter(item => item.isCaughtUp === false)
      .sort((a, b) => {
        if (a.isCaughtUp !== b.isCaughtUp) {
          return Number(a.isCaughtUp) - Number(b.isCaughtUp);
        }
        if (a.isNewRelease !== b.isNewRelease) {
          return Number(b.isNewRelease) - Number(a.isNewRelease);
        }

        return 0;
      });

    return (
      <div className="pt-4 ph-2 pb-6 mw-600 mh-auto">
        <CollectionNavigation collectionSlug={collectionSlug} />
        <div className="mb-4">
          <Route
            path={`/c/${collectionSlug}/`}
            exact
            render={() =>
              unreadFeedItems.map(item => (
                <div
                  key={item.series.id}
                  className={cx('pt-2 mt-2', nextChapterDivider)}>
                  <FeedItemRow feedItem={item} />
                </div>
              ))
            }
          />
          <Route
            path={`/c/${collectionSlug}/library`}
            exact
            render={() =>
              feedItems.map(item => (
                <SeriesRow key={item.series.id} feedItem={item} />
              ))
            }
          />
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
      const { lastReadAt, lastReadChapterId, linkTo } = bookmarks[seriesId];

      const series = seriesById[seriesId];
      const chapterIds = series ? series.chapters || [] : [];
      const chapters = chapterIds.map(id => chaptersById[id]);

      return {
        series,
        chapters,
        isCaughtUp:
          chapters.length > 0 ? chapters[0].id === lastReadChapterId : true,
        isNewRelease: chapters.some(chapter => chapter.createdAt > lastReadAt),
        lastReadChapterId,
        linkTo,
      };
    })
    // Ignore bookmarks where the series hasn't loaded
    .filter(item => item.series)
    .sort((a, b) => {
      return a.series.title.localeCompare(b.series.title);
    });

  return { feedItems };
};

export default withRouter(connect(mapStateToProps)(Feed));
