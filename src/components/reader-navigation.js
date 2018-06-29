// @flow

import React from 'react';

import Icon from '../components/icon';
import Popover from '../components/popover';
import ReaderChapterPicker from '../containers/reader-chapter-picker';
import ReaderChapterLink from '../components/reader-chapter-link';

import type { Chapter, Series } from '../types';

type Props = {
  isBottom: boolean,
  chapter: Chapter,
  collectionSlug: ?string,
  onChapterSelectChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
  seriesChapters: Series,
};

const ReaderNavigation = ({
  isBottom,
  chapter,
  collectionSlug,
  onChapterSelectChange,
  seriesChapters,
}: Props) => {
  const chapterIndex = seriesChapters.findIndex(c => c.id === chapter.id);
  const previousChapter = seriesChapters[chapterIndex + 1] || null;
  const nextChapter = seriesChapters[chapterIndex - 1] || null;

  return (
    <nav className="p-relative c-white x xa-center xj-spaceBetween mw-500 mh-auto pv-2 ph-3">
      <div className="z-2">
        <ReaderChapterLink
          collectionSlug={collectionSlug}
          chapter={previousChapter}>
          <Icon name="direct-left" />
        </ReaderChapterLink>
      </div>
      <Popover
        content={({ close }) => (
          <div
            style={{
              overflowY: 'scroll',
              webkitOverflowScrolling: 'touch',
              minWidth: 240,
              maxWidth: '90vw',
              height: '50vh',
              zIndex: 9,
            }}>
            <ReaderChapterPicker
              chapter={chapter}
              seriesChapters={seriesChapters}
              onChange={chapter => {
                onChapterSelectChange(chapter);
                close();
              }}
            />
          </div>
        )}
        position={isBottom ? Popover.Position.TOP : Popover.Position.BOTTOM}>
        <a
          className="PillLink pv-2 ph-3 d-inlineBlock c-white c-pointer ta-center"
          style={{ lineHeight: '1.25' }}>
          <div className="x xa-center xj-center" style={{ lineHeight: '24px' }}>
            <span className="ml-1 mr-2">Chapter {chapter.chapterNumber}</span>
            <Icon name="direct-down" size={18} iconSize={18} />
          </div>
          {chapter.title && (
            <div className="mt-1 fs-12 o-50p">{chapter.title}</div>
          )}
        </a>
      </Popover>
      <div className="z-2">
        <ReaderChapterLink
          collectionSlug={collectionSlug}
          chapter={nextChapter}>
          <Icon name="direct-right" />
        </ReaderChapterLink>
      </div>
    </nav>
  );
};

export default ReaderNavigation;
