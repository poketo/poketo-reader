// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import utils from '../utils';

import ChapterRow from '../components/chapter-row';
import type { Chapter } from '../types';

type Props = {
  chapter: Chapter,
  seriesChapters: Chapter[],
  onChange: (chapter: Chapter) => void,
};

export default class ReaderChapterPicker extends Component<Props> {
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
    const groups = Object.keys(groupedChapters)
      .sort()
      .reverse();

    return (
      <div
        style={{
          background: 'white',
          padding: 16,
          overflowY: 'scroll',
          width: '90vw',
          height: 500,
          zIndex: 9,
        }}>
        {groups.map((key, index) => (
          <div key={key} className={classNames({ 'mt-5': index !== 0 })}>
            <div
              className="fs-14 c-gray3 pv-2 bgc-white"
              style={{ position: 'sticky', top: 0 }}>
              {key === 'undefined' ? `Uncategorized` : `Volume ${key}`}
            </div>
            {groupedChapters[key].map(chapter => (
              <ChapterRow
                key={chapter.id}
                chapter={chapter}
                onClick={this.handleChapterClick(chapter)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}
