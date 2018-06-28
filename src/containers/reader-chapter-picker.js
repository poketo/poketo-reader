// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import utils from '../utils';

import ChapterRow from '../components/chapter-row';
import type { Chapter } from '../types';

type Props = {
  chapter: Chapter,
  seriesChapters: Chapter[],
  onChange: (chapter: Chapter) => void,
};

/**
 * Sort volumes so non-numeric comes first, followed by descending numeric.
 */
const sortVolumes = (a, b) => {
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

export default class ReaderChapterPicker extends PureComponent<Props> {
  static defaultProps = {
    onChange: () => {},
  };

  handleChapterClick = (chapter: Chapter) => (
    e: SyntheticMouseEvent<HTMLDivElement>,
  ) => {
    if (chapter.id === this.props.chapter.id) {
      return;
    }

    this.props.onChange(chapter);
  };

  render() {
    const { seriesChapters } = this.props;

    const groupedChapters = utils.groupBy(seriesChapters, 'volumeNumber');
    const groups = Object.keys(groupedChapters).sort(sortVolumes);

    return (
      <div
        style={{
          overflowY: 'scroll',
          width: '90vw',
          height: '50vh',
          zIndex: 9,
        }}>
        {groups.map((key, index) => (
          <div key={key} className={classNames({ 'mt-4': index !== 0 })}>
            <div
              className="fs-14 c-gray3 pt-2 pb-1 mb-1 bgc-white bb-1 bc-gray1 ph-2"
              style={{ position: 'sticky', top: 0 }}>
              {key === 'undefined' ? `Latest` : `Volume ${key}`}
            </div>
            <div className="ph-2">
              {groupedChapters[key].map(chapter => (
                <ChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  onClick={this.handleChapterClick(chapter)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
