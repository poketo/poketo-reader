// @flow

import React from 'react';
import utils from '../utils';
import type { Chapter } from '../types';
import './chapter-row.css';

type Props = {
  chapter: Chapter,
  onClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
};

const ChapterRow = ({ chapter, onClick }: Props) => {
  const hasChapterNumber = Boolean(chapter.chapterNumber);

  return (
    <div
      className="ChapterRow x xa-center xj-spaceBetween pv-2 ph-3 c-pointer"
      onClick={onClick}>
      <div className="xg-1">
        <span className="fw-semibold">
          {hasChapterNumber
            ? `Chapter ${chapter.chapterNumber}`
            : chapter.title}
        </span>
        {hasChapterNumber &&
          chapter.title && <span className="ml-2">{chapter.title}</span>}
      </div>
      <span className="xs-1 fs-12 o-50p pl-2 pl-4-m ta-right">
        {utils.formatAbsoluteTimestamp(chapter.createdAt)}
      </span>
    </div>
  );
};

export default ChapterRow;
