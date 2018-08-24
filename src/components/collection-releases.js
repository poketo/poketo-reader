// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import utils from '../utils';
import type { FeedItem } from '../types';

type Props = {
  collectionSlug: string,
  feedItems: FeedItem[],
};

class Releases extends Component<Props> {
  render() {
    const { collectionSlug, feedItems } = this.props;

    return (
      <div>
        {feedItems.length > 0 ? (
          feedItems.map(item => (
            <div>
              <h3>{item.series.title}</h3>
              {item.chapters.map(chapter => {
                const chapterLabel = utils.getChapterLabel(chapter, true);
                const chapterTitle = utils.getChapterTitle(chapter);

                return (
                  <Link to={`/c/${collectionSlug}/read/${chapter.id}`}>
                    {chapterLabel}
                    {chapterTitle && `: ${chapterTitle}`}
                  </Link>
                );
              })}
            </div>
          ))
        ) : (
          <div>No new updates! </div>
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
        chapters: series.chapters
          ? series.chapters
              .map(id => chaptersById[id])
              .filter(chapter => chapter.createdAt > bookmark.lastReadAt)
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
