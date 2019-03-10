// @flow

import React, { PureComponent, type ElementRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { ChapterMetadata } from 'poketo';
import { BookmarkContext } from '../views/reader-view';
// import utils from '../utils';
import ChapterRow from '../components/chapter-row';

type Props = {
  className?: string,
  innerRef: ElementRef<*>,
  activeChapterId?: string,
  seriesChapters: ChapterMetadata[],
  onChapterClick: () => void,
};

type RowProps = {
  data: ChapterMetadata[],
  index: number,
  style: { position: string, left: number, top: number, height: number, width: string}
}

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
    const { seriesChapters, activeChapterId, innerRef, className } = this.props;

    return (
      <List
        className={className}
        ref={innerRef}
        height={500}
        width="100%"
        itemData={seriesChapters}
        itemCount={seriesChapters.length}
        itemSize={44}>
        {({ data, index, style }: RowProps) => {
          const chapter = data[index];
          const isActive = chapter.id === activeChapterId;

          return(
            <BookmarkContext.Consumer>
              {bookmark => (
                <ChapterRow
                  chapter={chapter}
                  style={style}
                  bookmark={bookmark}
                  isActive={isActive}
                  onClick={this.handleChapterClick}
                />
              )}
            </BookmarkContext.Consumer>
          );
        }}
      </List>
    );
  }
}
