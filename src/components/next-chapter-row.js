// @flow

import React from 'react';
import { cx } from 'react-emotion';
import { Link } from 'react-router-dom';
import type { FeedItem } from '../types';
import utils from '../utils';

const NewReleaseIndicator = ({ className }: { className?: string }) => (
  <span
    className={cx(
      className,
      'p-relative d-inlineBlock br-pill c-white bgc-coral ta-center tt-uppercase us-none',
    )}
    css="top: -3px; font-size: 8px; letter-spacing: 2px; padding: 2px 3px 0 6px;">
    New
  </span>
);

type Props = {
  feedItem: FeedItem,
};

const NextChapterRow = ({ feedItem: item }: Props) => {
  const chapter = utils.nextChapterToRead(
    item.chapters,
    item.lastReadChapterId,
  );

  const chapterLabel = utils.getChapterLabel(chapter, true);
  const chapterTitle = utils.getChapterTitle(chapter);
  const to = utils.getReaderUrl(chapter.id);

  return (
    <div>
      <Link to={utils.getSeriesUrl(item.series.id)}>
        <span className="d-inlineBlock c-gray3 fs-14 fs-16-m ph-2 pv-1 mb-1 hover-bg">
          {item.series.title}
        </span>
      </Link>
      <Link to={to} className="x xa-center pa-2 hover-bg ws-noWrap">
        <div className="xs-1 of-hidden to-ellipsis">
          <div
            className={cx('fs-16 fs-18-m fw-semibold lh-1d25', {
              'c-coral': item.isNewRelease,
            })}>
            {chapterLabel}
            {item.isNewRelease && <NewReleaseIndicator className="ml-2" />}
          </div>
          {chapterTitle && (
            <div className="fs-14 fs-16-m of-hidden to-ellipsis">
              {chapterTitle}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default NextChapterRow;
