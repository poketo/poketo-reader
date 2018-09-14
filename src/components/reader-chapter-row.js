// @flow

import React, { type ElementRef } from 'react';
import styled, { css, cx } from 'react-emotion';
import Icon from '../components/icon';
import utils from '../utils';
import type { Chapter } from '../types';

type Props = {
  chapter: Chapter,
  innerRef?: ElementRef<*>,
  isActive?: boolean,
  isUnread?: boolean,
  onClick: (e: SyntheticMouseEvent<HTMLDivElement>) => void,
};

const StyledContainer = styled.div`
  min-height: 44px;

  .supports-hover &:hover {
    background-color: #f2f2f2; /* gray0 */
  }

  ${props =>
    props.isActive &&
    css`
      background-color: #f2f2f2; /* gray0 */
    `};
`;

const ChapterRow = (props: Props) => {
  const { chapter, innerRef, isActive, isUnread, onClick } = props;

  const chapterLabel = utils.getChapterLabel(chapter);
  const chapterTitle = utils.getChapterTitle(chapter);

  return (
    <StyledContainer
      className="x xa-center xj-spaceBetween pv-2 ph-3 c-pointer"
      isActive={isActive}
      innerRef={innerRef}
      onClick={onClick}>
      {isActive ? (
        <span className="p-relative x xa-center mr-2 t--1 o-50p">
          <Icon name="check" size={18} iconSize={18} />
        </span>
      ) : (
        isUnread && (
          <span className="p-relative t--2 mr-2">
            <span className="d-inlineBlock w-8 h-8 br-round bgc-coral" />
          </span>
        )
      )}
      <div
        className={cx('of-hidden ws-noWrap to-ellipsis xs-1', {
          'o-50p': isActive,
        })}>
        <span className="fw-semibold">{chapterLabel}</span>
        {chapterTitle && <span className="ml-2">{chapterTitle}</span>}
      </div>
      <span className="xg-1 xs-0 fs-12 o-50p pl-2 pl-4-m ta-right">
        {utils.formatTimestamp(chapter.createdAt)}
      </span>
    </StyledContainer>
  );
};

ChapterRow.defaultProps = {
  isActive: false,
  isUnread: false,
};

export default ChapterRow;
