// @flow

import React from 'react';

import Icon from '../components/icon';
import Button from '../components/button';
import Dropdown from '../components/dropdown';
import Popover from '../components/popover';
import ReaderChapterPicker from '../containers/reader-chapter-picker';
import ReaderChapterLink from '../components/reader-chapter-link';

import type { Chapter, Series } from '../types';

type Props = {
  chapter: Chapter,
  collectionSlug: ?string,
  onChapterSelectChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
  seriesChapters: Series,
};

const getChapterLabel = (chapter): string => {
  const parts = [
    chapter.volumeNumber &&
      chapter.volumeNumber !== '0' &&
      `Vol. ${chapter.volumeNumber}`,
    chapter.chapterNumber && `Chapter ${chapter.chapterNumber}`,
  ].filter(Boolean);

  if (parts.length === 0) {
    return chapter.title;
  }

  return parts.join(' - ');
};

const ReaderNavigation = ({
  chapter,
  collectionSlug,
  onChapterSelectChange,
  seriesChapters,
}: Props) => {
  const chapterSelectorOptions = seriesChapters
    ? seriesChapters.map(c => ({
        value: c.slug,
        label: getChapterLabel(c),
      }))
    : [{ value: '', label: '' }];

  const chapterIndex = seriesChapters.findIndex(c => c.id === chapter.id);
  const previousChapter = seriesChapters[chapterIndex + 1] || null;
  const nextChapter = seriesChapters[chapterIndex - 1] || null;

  return (
    <nav className="p-relative c-white x xa-center xj-spaceBetween mw-500 mh-auto pv-2 ph-3 fs-14 fs-16-m">
      <div className="z-2">
        <ReaderChapterLink
          collectionSlug={collectionSlug}
          chapter={previousChapter}>
          <Icon name="direct-left" />
        </ReaderChapterLink>
      </div>
      <div>
        <Popover
          content={({ close }) => (
            <ReaderChapterPicker
              chapter={chapter}
              seriesChapters={seriesChapters}
              onChange={chapter => {
                onChapterSelectChange(chapter);
                close();
              }}
            />
          )}
          position={Popover.Position.BOTTOM}>
          <Button className="c-white">
            <div style={{ lineHeight: '1.25' }}>
              <div>Chapter {chapter.chapterNumber}</div>
              <div className="fs-12 o-50p">{chapter.title}</div>
            </div>
          </Button>
        </Popover>
      </div>
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
