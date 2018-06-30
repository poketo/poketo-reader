// @flow

import React from 'react';
import classNames from 'classnames';
import Icon from '../components/icon';
import utils from '../utils';
import type { Chapter } from '../types';
import './chapter-row.css';

type Props = {
  chapter: Chapter,
  isActive?: boolean,
  isUnread?: boolean,
  onClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
};

const ChapterRow = ({ chapter, isActive, isUnread, onClick }: Props) => {
  const chapterLabel = utils.getChapterLabel(chapter);
  const chapterTitle = utils.getChapterTitle(chapter);

  return (
    <div
      className={classNames(
        'ChapterRow x xa-center xj-spaceBetween pv-2 ph-3 c-pointer',
        { 'ChapterRow--active': isActive },
      )}
      onClick={onClick}>
      {isActive ? (
        <span className="ChapterRow-check p-relative x xa-center mr-2 t--1">
          <Icon name="check" size={18} iconSize={18} />
        </span>
      ) : (
        isUnread && (
          <span className="p-relative t--2 mr-2">
            <span className="d-inlineBlock w-8 h-8 br-round bgc-coral" />
          </span>
        )
      )}
      <div className="ChapterRow-label xs-1">
        <span className="fw-semibold">{chapterLabel}</span>
        {chapterTitle && <span className="ml-2">{chapter.title}</span>}
      </div>
      <span className="xg-1 xs-0 fs-12 o-50p pl-2 pl-4-m ta-right">
        {utils.formatAbsoluteTimestamp(chapter.createdAt)}
      </span>
    </div>
  );
};

ChapterRow.defaultProps = {
  isActive: false,
  isUnread: false,
};

export default ChapterRow;
