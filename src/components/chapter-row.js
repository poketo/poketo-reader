// @flow

import React from 'react';
import type { ChapterMetadata } from 'poketo';
import { Link } from 'react-router-dom';
import Icon from './icon';
import utils from '../utils';

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
    <Link className="x xj-start xa-center pv-2" to={to}>
      {isLastReadChapter && (
        <Icon
          name="bookmark"
          className="mr-2 c-green"
          size={20}
          iconSize={20}
        />
      )}
      <div className="of-hidden to-ellipsis ws-noWrap">
        {chapterLabel}
        {chapterTitle && `: ${chapterTitle}`}
      </div>
      <div className="ml-auto pl-4 xs-0 fs-12 o-50p">
        {utils.formatTimestamp(chapter.createdAt)}
      </div>
    </Link>
  );
};

ChapterRow.defaultProps = {
  extendedLabel: false,
  isLastReadChapter: false,
};

export default ChapterRow;
