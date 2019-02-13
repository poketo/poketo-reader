// @flow

import React from 'react';
import { css, cx } from 'react-emotion/macro';
import { Link } from 'react-router-dom';
import type { ChapterMetadata } from 'poketo';
import type { Bookmark } from '../../shared/types';
import Icon from './icon';
import utils from '../utils';

const newReleaseIndicatorClassName = css`
  width: 8px;
  height: 8px;
`;

const NewReleaseIndicator = () => (
  <div
    className={cx(
      'p-relative br-round bgc-coral xjs-center',
      newReleaseIndicatorClassName,
    )}
  />
);

const styles = {
  base: css`
    display: grid;
    grid-template-columns: 16px auto auto;
    grid-column-gap: 8px;

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
      className={cx('pv-2 ph-3 xa-center', styles.base, {
        [styles.isActive]: isActive,
        [styles.isLastRead]: isLastRead && !isActive,
      })}
      to={to}
      {...rest}>
      {isActive ? (
        <Icon
          name="check"
          className="c-gray3 xjs-center"
          size={16}
          iconSize={16}
        />
      ) : isLastRead ? (
        <Icon
          name="bookmark-filled"
          className="c-green xjs-center"
          size={16}
          iconSize={16}
        />
      ) : isNewRelease ? (
        <NewReleaseIndicator />
      ) : (
        <div />
      )}
      <div className="of-hidden to-ellipsis ws-noWrap">
        <span className="fw-semibold">{chapterLabel}</span>
        {chapterTitle && <span className="ml-2">{chapterTitle}</span>}
      </div>
      <span className="ta-right fs-12 o-50p">
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
