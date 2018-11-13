// @flow

import React, { PureComponent, type ElementRef } from 'react';
import { cx } from 'react-emotion/macro';
import type { ChapterMetadata } from 'poketo';
import type { Bookmark } from '../../shared/types';
import utils from '../utils';
import ChapterRow from '../components/chapter-row';

type Props = {
  activeChapterId?: string,
  activeChapterRef?: ElementRef<*>,
  seriesChapters: ChapterMetadata[],
  bookmark?: Bookmark,
  onChapterClick: () => void,
};

const shouldGroupByVolume = (seriesChapters: ChapterMetadata[]) => {
  return seriesChapters.some(c => Boolean(c.chapterNumber));
};

/**
 * Sort volumes so non-numeric comes first, followed by descending numeric.
 */
const sortVolumes = (a: string, b: string): number => {
  const volumeA = parseFloat(a);
  const volumeB = parseFloat(b);

  if (Number.isNaN(volumeA) && !Number.isNaN(volumeB)) {
    return -1;
  } else if (!Number.isNaN(volumeA) && Number.isNaN(volumeB)) {
    return 1;
  }

  if (volumeA < volumeB) {
    return 1;
  } else if (volumeA > volumeB) {
    return -1;
  }

  return 0;
};

const isEmptyVolume = (key: string): boolean => {
  return key === 'undefined' || key === '0';
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

  renderChapters(chapters: ChapterMetadata[]) {
    const { activeChapterId, activeChapterRef, bookmark } = this.props;

    return (
      <div>
        {chapters.map((c: ChapterMetadata) => {
          const isActive = c.id === activeChapterId;

          return (
            <ChapterRow
              key={c.id}
              chapter={c}
              bookmark={bookmark}
              innerRef={isActive ? activeChapterRef : undefined}
              isActive={isActive}
              onClick={this.handleChapterClick}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { seriesChapters } = this.props;

    if (!shouldGroupByVolume(seriesChapters)) {
      return this.renderChapters(seriesChapters);
    }

    const groupedChapters = utils.groupBy(seriesChapters, 'volumeNumber');
    const groups = Object.keys(groupedChapters).sort(sortVolumes);

    return (
      <div>
        {groups.map((key, index) => (
          <div key={key} className={cx({ 'mt-4': index !== 0 })}>
            {!isEmptyVolume(key) && (
              <div className="p-sticky t-0 z-3 fs-14 fs-16-m c-gray3 pt-2 pb-1 pb-2-m ph-3 bgc-white bb-1 bc-gray1">
                Volume {key}
              </div>
            )}
            {this.renderChapters(groupedChapters[key])}
          </div>
        ))}
      </div>
    );
  }
}
