// @flow

import React from 'react';
import Dropdown from '../components/dropdown';
import ReaderChapterLink from '../components/reader-chapter-link';

import type { Chapter, Series } from '../types';

type Props = {
  chapter: Chapter,
  collectionSlug: ?string,
  onChapterSelectChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
  seriesChapters: Series,
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
        label: `Chapter ${c.chapterNumber}`,
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
          Previous
        </ReaderChapterLink>
      </div>
      <div className="p-fill b-0 z-1 x xj-center xa-center">
        <Dropdown
          value={chapter.slug}
          onChange={onChapterSelectChange}
          options={chapterSelectorOptions}
        />
      </div>
      <div className="z-2">
        <ReaderChapterLink
          collectionSlug={collectionSlug}
          chapter={nextChapter}>
          Next
        </ReaderChapterLink>
      </div>
    </nav>
  );
};

export default ReaderNavigation;
