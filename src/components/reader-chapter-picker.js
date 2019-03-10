// @flow

import React, { PureComponent, type ElementRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import ChapterRow from '../components/chapter-row';
import type { Bookmark } from '../../shared/types';
import type { ChapterMetadata } from 'poketo';

type Props = {
  className?: string,
  bookmark: ?Bookmark,
  innerRef: ElementRef<*>,
  activeChapterId?: string,
  seriesChapters: ChapterMetadata[],
  onChapterClick: () => void,
};

type RowProps = {
  data: ChapterMetadata[],
  index: number,
  style: {
    position: string,
    left: number,
    top: number,
    height: number,
    width: string,
  },
};

export default class ReaderChapterPicker extends PureComponent<Props> {
  static defaultProps = {
    onChapterClick: () => {},
  };

  handleChapterClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    if (
      e.ctrlKey ||
      e.shiftKey ||
      e.metaKey ||
      (e.button && e.button === 1) // middle click, >IE9 + everyone else
    ) {
      return;
    }

    this.props.onChapterClick();
  };

  render() {
    const {
      seriesChapters,
      bookmark,
      activeChapterId,
      innerRef,
      className,
    } = this.props;

    return (
      <List
        className={className}
        ref={innerRef}
        height={400}
        width="100%"
        itemData={seriesChapters}
        itemCount={seriesChapters.length}
        itemSize={44}>
        {({ data, index, style }: RowProps) => {
          const chapter = data[index];
          const isActive = chapter.id === activeChapterId;

          return (
            <ChapterRow
              chapter={chapter}
              style={style}
              bookmark={bookmark}
              isActive={isActive}
              onClick={this.handleChapterClick}
            />
          );
        }}
      </List>
    );
  }
}
