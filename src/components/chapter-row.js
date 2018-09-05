// @flow

import React from 'react';
import type { ChapterMetadata } from 'poketo';
import { Link } from 'react-router-dom';
import utils from '../utils';

type Props = {
  chapter: ChapterMetadata,
  collectionSlug?: string,
  extendedLabel?: boolean,
};

const ChapterRow = ({ chapter, collectionSlug, extendedLabel }: Props) => {
  const chapterLabel = utils.getChapterLabel(chapter, extendedLabel);
  const chapterTitle = utils.getChapterTitle(chapter);
  const to = utils.getReaderUrl(chapter.id);

  return (
    <Link className="x xj-spaceBetween xa-center pv-2" to={to}>
      <div className="of-hidden to-ellipsis ws-noWrap">
        {chapterLabel}
        {chapterTitle && `: ${chapterTitle}`}
      </div>
      <div className="pl-4 xs-0 fs-12 o-50p">
        {utils.formatTimestamp(chapter.createdAt)}
      </div>
    </Link>
  );
};

ChapterRow.defaultProps = {
  extendedLabel: false,
};

export default ChapterRow;
