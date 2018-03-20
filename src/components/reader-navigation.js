// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from '../components/dropdown';
import IconArrowLeft from '../components/icon-arrow-left';
import IconNewTab from '../components/icon-new-tab';
import utils from '../utils';
import type { Chapter, Series } from '../types';

type Props = {
  currentCollectionSlug: ?string,
  currentChapter: ?Chapter,
  currentSeries: ?Series,
  onChapterSelectChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
};

const ReaderNavigation = (props: Props) => {
  const {
    currentCollectionSlug,
    currentSeries,
    currentChapter,
    onChapterSelectChange,
  } = props;

  const chapterSelectorOptions = currentSeries
    ? currentSeries.chapters.map(c => ({
        value: c.slug,
        label: `Chapter ${c.number}`,
      }))
    : [{ value: '', label: '' }];

  return (
    <nav className="p-relative bgc-black c-white x xa-center xj-end pv-3 ph-3 fs-14 fs-16-m">
      {currentChapter && (
        <Fragment>
          <div className="p-absolute t-0 l-8 b-0 x xj-center xa-center">
            <Dropdown
              value={currentChapter.slug}
              onChange={onChapterSelectChange}
              options={chapterSelectorOptions}
            />
          </div>
          <a
            className="x xa-center o-50p p-relative z-2"
            href={currentChapter.url}
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
