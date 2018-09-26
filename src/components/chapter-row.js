// @flow

import React from 'react';
import styled, { css } from 'react-emotion';
import { Link } from 'react-router-dom';
import type { ChapterMetadata } from 'poketo';
import type { Bookmark } from '../types';
import Icon from './icon';
import utils from '../utils';

const StyledLink = styled(Link)`
  border-radius: 3px;
  min-height: 44px;
  transition: background-color 100ms ease;

  ${props =>
    props.isLastRead
      ? css`
          background-color: rgba(19, 207, 131, 0.07);

          .supports-hover &:hover {
            background-color: rgba(19, 207, 131, 0.15);
          }
        `
      : css`
          .supports-hover &:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        `};
`;

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
    <StyledLink
      className="x xa-center xj-start pv-2 ph-3"
      to={to}
      isLastRead={isLastRead}>
      {isLastRead ? (
        <Icon
          name="bookmark-filled"
          className="p-relative mr-2 c-green"
          css="left: -2px;"
          size={24}
          iconSize={24}
        />
      ) : isNewRelease ? (
        <div
          className="p-relative mr-2 br-round bgc-coral"
          css="width: 8px; height: 8px; left: -2px;"
        />
      ) : null}
      <div className="of-hidden to-ellipsis ws-noWrap">
        <span className="fw-semibold">{chapterLabel}</span>
        {chapterTitle && <span className="ml-2">{chapterTitle}</span>}
      </div>
      <span className="ml-auto pl-4 xs-0 fs-12 o-50p">
        {utils.formatTimestamp(chapter.createdAt)}
      </span>
    </StyledLink>
  );
};

ChapterRow.defaultProps = {
  extendedLabel: false,
  isActive: false,
};

export default ChapterRow;
