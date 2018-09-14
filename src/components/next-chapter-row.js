// @flow

import React from 'react';
import { css, cx } from 'react-emotion';
import { Link } from 'react-router-dom';
import type { FeedItem } from '../types';
import CoverImage from './series-cover-image';
import Icon from './icon';
import utils from '../utils';

const NewReleaseIndicator = ({ className }: { className?: string }) => (
  <span
    className={cx(className, 'p-relative d-inlineBlock br-round bgc-coral')}
    css="top: -2px; width: 6px; height: 6px; flex-basis: 6px; flex-shrink: 0;"
  />
);

const grayBadge = css`
  border: 1px solid rgba(0, 0, 0, 0.09);
  color: #444443;
`;

const greenBadge = css`
  background-color: rgba(71, 228, 165, 0.15);
  color: rgba(73, 117, 99, 1);
`;

const SeriesTitleBadge = ({ isNewRelease, ...props }) => (
  <div
    className={cx('d-inlineBlock br-3 fs-12 fs-14-m fw-semibold mb-2', {
      'c-coral bgc-extraFadedLightCoral': isNewRelease,
      [grayBadge]: !isNewRelease,
      // [greenBadge]: !isNewRelease,
    })}
    css={`
      padding: 2px 6px 0;
    `}
    {...props}
  />
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
    <Link to={to} className="x xa-center pa-2 hover-bg ws-noWrap">
      <CoverImage
        className="mr-2 mr-3-m"
        series={item.series}
        variant="small"
      />
      <div className="xs-1 of-hidden to-ellipsis">
        <SeriesTitleBadge isNewRelease={item.isNewRelease}>
          {item.series.title}
        </SeriesTitleBadge>
        <div
          className={cx('fs-16 fs-18-m fw-semibold lh-1d25', {
            'c-coral': item.isNewRelease,
          })}>
          {item.isNewRelease && (
            <NewReleaseIndicator css="margin-right: 6px; margin-left: 4px;" />
          )}
          {chapterLabel}
        </div>
        {chapterTitle && (
          <div className="fs-14 c-gray3 of-hidden to-ellipsis">
            {chapterTitle}
          </div>
        )}
      </div>
      <span className="pl-1 ml-auto fs-12 c-gray4 ta-right x">
        <Icon name="arrow-right" iconSize={18} />
      </span>
    </Link>
  );
};

export default NextChapterRow;
