// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import utils from '../utils';

import ChapterRow from '../components/chapter-row';
import type { Chapter } from '../types';

type Props = {
  chapter: Chapter,
  seriesChapters: Chapter[],
  onChapterClick: (chapter: Chapter) => void,
};

const shouldGroupByVolume = (seriesChapters: Chapter[]) => {
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

  handleChapterClick = (chapter: Chapter) => (
    e: SyntheticMouseEvent<HTMLDivElement>,
  ) => {
    this.props.onChapterClick(chapter);
  };

  renderChapters(chapters: Chapter[]) {
    const { chapter } = this.props;

    return (
      <div>
        {chapters.map(c => (
          <ChapterRow
            key={c.id}
            active={c.id === chapter.id}
            chapter={c}
            onClick={this.handleChapterClick(c)}
          />
        ))}
      </div>
    );
  }

  render() {
    const { chapter, seriesChapters } = this.props;

    if (!shouldGroupByVolume(seriesChapters)) {
      return this.renderChapters(seriesChapters);
    }

    const groupedChapters = utils.groupBy(seriesChapters, 'volumeNumber');
    const groups = Object.keys(groupedChapters).sort(sortVolumes);

    return (
      <div>
        {groups.map((key, index) => (
          <div key={key} className={classNames({ 'mt-4': index !== 0 })}>
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
