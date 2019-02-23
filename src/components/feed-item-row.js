// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import type { FeedItem } from '../types';
import NextChapterRow from '../components/next-chapter-row';
import utils from '../utils';

type Props = {
  feedItem: FeedItem,
};

const FeedItemRow = ({ feedItem: item }: Props) => {
  const chapter = utils.nextChapterToRead(
    item.chapters,
    item.lastReadChapterId,
  );

  const seriesTo = utils.getSeriesUrl(item.series.id);

  return (
    <div>
      <Link to={seriesTo}>
        <span className="d-inlineBlock c-gray3 fs-14 fs-16-m ph-2 pv-1 mb-1 hover-bg">
          {item.title}
        </span>
      </Link>
      <NextChapterRow chapter={chapter} isNewRelease={item.isNewRelease} />
    </div>
  );
};

export default FeedItemRow;
