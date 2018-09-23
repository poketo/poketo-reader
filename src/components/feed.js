// @flow

import React, { Component } from 'react';
import { cx, css } from 'react-emotion';
import { connect } from 'react-redux';
import { Route, NavLink, withRouter } from 'react-router-dom';
import NextChapterRow from './next-chapter-row';
import SeriesRow from './series-row';
import type { Bookmark, FeedItem } from '../types';

const nextChapterDivider = css`
  & + & {
    border-top: 1px #f2f2f2 solid;
  }
`;

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
        <header className="x ph-2 mb-4">
          <NavLink
            to={`/c/${collectionSlug}`}
            exact
            className="fs-20 fs-24-m fw-semibold"
            activeClassName="c-coral">
            Now Reading
          </NavLink>
          <NavLink
            to={`/c/${collectionSlug}/library`}
            exact
            className="fs-20 fs-24-m fw-semibold ml-3"
            activeClassName="c-coral">
            Library
          </NavLink>
        </header>
        <div className="mb-4">
          <Route
            path={`/c/${collectionSlug}/`}
            exact
            render={() =>
              unreadFeedItems.map(item => (
                <div
                  key={item.series.id}
                  className={cx('pt-2 mt-2', nextChapterDivider)}>
                  <NextChapterRow
                    collectionSlug={collectionSlug}
                    feedItem={item}
                  />
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
      return a.series.title.localeCompare(b.series.title);
    });

  return { feedItems };
};

export default withRouter(connect(mapStateToProps)(Feed));
