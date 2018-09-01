// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Icon from './icon';
import CoverImage from './series-cover-image';
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
              <h1 className="fs-18 fw-semibold">New Releases</h1>
            </header>
            {feedItems.map(item => (
              <div key={item.series.id} className="mb-4">
                <Link to={`/series/${item.series.id}`} className="d-block mb-3">
                  <div className="x xa-center">
                    <div className="mr-3" style={{ width: 60 }}>
                      <CoverImage series={item.series} />
                    </div>
                    <div>
                      <h3>{item.series.title}</h3>
                      <h4 className="fs-14">{item.series.site.name}</h4>
                    </div>
                  </div>
                </Link>
                {item.chapters
                  .reverse()
                  .slice(0, 3)
                  .map(chapter => (
                    <ChapterRow
                      key={chapter.id}
                      chapter={chapter}
                      extendedLabel
                    />
                  ))}
                {item.chapters.length > 3 && (
                  <Link
                    to={`/series/${item.series.id}`}
                    className="d-block pv-3 ta-center">
                    <span className="fs-14 o-50p">
                      And {item.chapters.length - 3} more...
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </Fragment>
        ) : (
          <div className="x xj-center ta-center">
            <div>
              <div>No new updates!</div>
              <Link to={`/c/${collectionSlug}/library`} className="x xa-center">
                <span className="pl-2">Go to Library</span>
                <Icon name="arrow-right" iconSize={16} />
              </Link>
            </div>
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
