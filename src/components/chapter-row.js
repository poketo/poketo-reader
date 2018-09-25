// @flow

import React from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import type { ChapterMetadata } from 'poketo';
import Icon from './icon';
import utils from '../utils';

const StyledLink = styled(Link)`
  min-height: 44px;
`;

type Props = {
  chapter: ChapterMetadata,
  collectionSlug?: string,
  extendedLabel?: boolean,
  isLastReadChapter?: boolean,
};

const ChapterRow = ({
  chapter,
  collectionSlug,
  extendedLabel,
  isLastReadChapter,
}: Props) => {
  const chapterLabel = utils.getChapterLabel(chapter, extendedLabel);
  const chapterTitle = utils.getChapterTitle(chapter);
  const to = utils.getReaderUrl(chapter.id);

  return (
    <StyledLink className="x xa-center xj-start pv-2" to={to}>
      {isLastReadChapter && (
        <Icon
          name="bookmark-filled"
          className="p-relative mr-2 c-green"
          css="left: -2px;"
          size={24}
          iconSize={24}
        />
      )}
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
  isLastReadChapter: false,
};

export default ChapterRow;
