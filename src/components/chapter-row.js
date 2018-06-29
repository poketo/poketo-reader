// @flow

import React from 'react';
import classNames from 'classnames';
import Icon from '../components/icon';
import utils from '../utils';
import type { Chapter } from '../types';
import './chapter-row.css';

type Props = {
  active?: boolean,
  chapter: Chapter,
  onClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
};

const ChapterRow = ({ active, chapter, onClick }: Props) => {
  const hasChapterNumber = Boolean(chapter.chapterNumber);

  return (
    <div
      className={classNames(
        'ChapterRow x xa-center xj-spaceBetween pv-2 ph-3 c-pointer',
        { 'ChapterRow--active': active },
      )}
      onClick={onClick}>
      {active && (
        <span className="p-relative x xa-center mr-2 t--1">
          <Icon name="check" size={18} iconSize={18} />
        </span>
      )}
      <div className="ChapterRow-label xs-1">
        <span className="fw-semibold">
          {hasChapterNumber
            ? `Chapter ${chapter.chapterNumber}`
            : chapter.title}
        </span>
        {hasChapterNumber &&
          chapter.title && <span className="ml-2">{chapter.title}</span>}
      </div>
      <span className="xg-1 xs-0 fs-12 o-50p pl-2 pl-4-m ta-right">
        {utils.formatAbsoluteTimestamp(chapter.createdAt)}
      </span>
    </div>
  );
};

ChapterRow.defaultProps = {
  active: false,
};

export default ChapterRow;
