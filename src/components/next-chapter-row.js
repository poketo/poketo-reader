// @flow

import React from 'react';
import { cx } from 'react-emotion';
import { Link } from 'react-router-dom';
import type { ChapterMetadata } from 'poketo';
import Icon from '../components/icon';
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
  chapter: ChapterMetadata,
  isNewRelease?: boolean,
};

const NextChapterRow = ({ chapter, isNewRelease }: Props) => {
  const chapterLabel = utils.getChapterLabel(chapter, true);
  const chapterTitle = utils.getChapterTitle(chapter);
  const to = utils.getReaderUrl(chapter.id);

  return (
    <Link
      to={to}
      className="x xa-center xj-spaceBetween pa-2 hover-bg ws-noWrap">
      <div className="xs-1 of-hidden to-ellipsis">
        <div
          className={cx('fs-16 fs-18-m fw-semibold lh-1d25', {
            'c-coral': isNewRelease,
          })}>
          {chapterLabel}
          {isNewRelease && <NewReleaseIndicator className="ml-2" />}
        </div>
        {chapterTitle && (
          <div className="fs-14 fs-16-m of-hidden to-ellipsis">
            {chapterTitle}
          </div>
        )}
      </div>
      <Icon name="direct-right" iconSize={20} />
    </Link>
  );
};

NextChapterRow.defaultProps = {
  isNewRelease: false,
};

export default NextChapterRow;
