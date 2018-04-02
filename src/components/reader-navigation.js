// @flow

import React, { Fragment } from 'react';
import Dropdown from '../components/dropdown';
import IconNewTab from '../components/icon-new-tab';

import type { Chapter, Series } from '../types';

type Props = {
  chapter: ?Chapter,
  onChapterSelectChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
  seriesChapters: ?Series,
};

const ReaderNavigation = ({
  chapter,
  onChapterSelectChange,
  seriesChapters,
}: Props) => {
  const chapterSelectorOptions = seriesChapters
    ? seriesChapters.map(c => ({
        value: c.slug,
        label: `Chapter ${c.number}`,
      }))
    : [{ value: '', label: '' }];

  return (
    <nav className="p-relative bgc-black c-white x xa-center xj-end pv-3 ph-3 fs-14 fs-16-m">
      {chapter && (
        <Fragment>
          <div className="p-absolute t-0 l-8 b-0 x xj-center xa-center">
            <Dropdown
              value={chapter.slug}
              onChange={onChapterSelectChange}
              options={chapterSelectorOptions}
            />
          </div>
          <a
            className="x xa-center o-50p p-relative z-2"
            href={chapter.url}
            title="Open chapter on original site"
            target="_blank"
            rel="noopener noreferrer">
            <IconNewTab width={20} height={20} />
          </a>
        </Fragment>
      )}
    </nav>
  );
};

export default ReaderNavigation;
