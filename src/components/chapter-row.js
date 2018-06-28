// @flow

import React from 'react';
import utils from '../utils';
import type { Chapter } from '../types';

type Props = {
  chapter: Chapter,
  onClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
};

const ChapterRow = ({ chapter, onClick }: Props) => (
  <div className="x xj-spaceBetween pv-1 c-pointer" onClick={onClick}>
    <div style={{ flex: '1 1 auto' }}>
      <span className="fw-semibold">{chapter.chapterNumber}</span>
      {chapter.title && <span className="ml-2">{chapter.title}</span>}
    </div>
    <span style={{ flex: '1 0 auto' }} className="fs-12 o-50p ta-right">
      {utils.formatTimestamp(chapter.createdAt)}
    </span>
  </div>
);

export default ChapterRow;
