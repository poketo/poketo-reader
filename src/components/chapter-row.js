// @flow

import React from 'react';
import { css, cx } from 'react-emotion';
import { Link } from 'react-router-dom';
import type { ChapterMetadata } from 'poketo';
import type { Bookmark } from '../types';
import Icon from './icon';
import utils from '../utils';

const NewReleaseIndicator = () => (
  <div
    className="p-relative mr-2 br-round bgc-coral"
    css="width: 8px; height: 8px; left: -2px;"
  />
);

const styles = {
  base: css`
    border-radius: 3px;
    min-height: 44px;
    transition: background-color 100ms ease;

    .supports-hover &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  `,
  isActive: css`
    background-color: #f2f2f2; /* gray0 */
  `,
  isLastRead: css`
    background-color: rgba(19, 207, 131, 0.07);
  `,
};

type Props = {
  chapter: ChapterMetadata,
  bookmark?: Bookmark,
  collectionSlug?: string,
  extendedLabel?: boolean,
  isActive?: boolean,
};

const ChapterRow = ({
  bookmark,
  chapter,
  collectionSlug,
  extendedLabel,
  isActive,
  ...rest
}: Props) => {
  const chapterLabel = utils.getChapterLabel(chapter, extendedLabel);
  const chapterTitle = utils.getChapterTitle(chapter);
  const to = utils.getReaderUrl(chapter.id);

  const isLastRead = bookmark
    ? bookmark.lastReadChapterId === chapter.id
    : false;
  const isNewRelease = bookmark
    ? bookmark.lastReadAt && chapter.createdAt > bookmark.lastReadAt
    : false;

  return (
    <Link
      className={cx('x xa-center xj-start pv-2 ph-3', styles.base, {
        [styles.isActive]: isActive,
        [styles.isLastRead]: isLastRead && !isActive,
      })}
      to={to}
      {...rest}>
      {isActive ? (
        <Icon
          name="check"
          className="p-relative mr-2 c-gray3"
          size={18}
          iconSize={24}
        />
      ) : isLastRead ? (
        <Icon
          name="bookmark-filled"
          className="p-relative mr-2 c-green"
          css="left: -2px;"
          size={24}
          iconSize={24}
        />
      ) : isNewRelease ? (
        <NewReleaseIndicator />
      ) : null}
      <div className="of-hidden to-ellipsis ws-noWrap">
        <span className="fw-semibold">{chapterLabel}</span>
        {chapterTitle && <span className="ml-2">{chapterTitle}</span>}
      </div>
      <span className="ml-auto pl-4 xs-0 fs-12 o-50p">
        {utils.formatTimestamp(chapter.createdAt)}
      </span>
    </Link>
  );
};

ChapterRow.defaultProps = {
  extendedLabel: false,
  isActive: false,
};

export default ChapterRow;
