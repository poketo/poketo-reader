// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ChapterRow from './chapter-row';
import type { FeedItem } from '../types';

type Props = {
  collectionSlug: string,
  feedItems: FeedItem[],
};

class Releases extends Component<Props> {
  render() {
    const { collectionSlug, feedItems } = this.props;

    return (
      <div className="pt-5 ph-3 mw-600 mh-auto">
        {feedItems.length > 0 ? (
          <Fragment>
            <header className="mb-3">
              <h1 className="fs-24 fw-semibold">Releases</h1>
            </header>
            {feedItems.map(item => (
              <div key={item.series.id}>
                <h3 className="mb-3">{item.series.title}</h3>
                {item.chapters.map(chapter => (
                  <ChapterRow
                    key={chapter.id}
                    chapter={chapter}
                    extendedLabel
                  />
                ))}
              </div>
            ))}
          </Fragment>
        ) : (
          <div>
            <div>No new updates!</div>
            <Link to={`/c/${collectionSlug}/library`}>Go to Library</Link>
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
      const series = seriesById[seriesId];
      const bookmark = bookmarks[seriesId];

      return {
        series,
        chapters: series
          ? series.chapters
            ? series.chapters
                .map(id => chaptersById[id])
                .filter(chapter => chapter.createdAt > bookmark.lastReadAt)
            : []
          : [],
        lastReadAt: bookmark.lastReadAt,
        linkTo: bookmark.linkTo,
      };
    })
    // Ignore bookmarks where the series hasn't loaded
    .filter(item => item.series)
    // Ignore series where we're caught up
    .filter(item => item.chapters.length > 0)
    .sort((a, b) => b.series.title.localeCompare(a.series.title));

  return { feedItems };
};

export default connect(mapStateToProps)(Releases);
