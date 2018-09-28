// @flow

import React, { type Node } from 'react';
import type { ChapterMetadata } from 'poketo';
import { cx } from 'react-emotion/macro';
import { Link } from 'react-router-dom';

import utils from '../utils';

type Props = {
  collectionSlug: ?string,
  chapter: ?ChapterMetadata,
  children: Node,
};

const ReaderChapterLink = ({ collectionSlug, chapter, children }: Props) => {
  const disabled = !chapter;
  const to = chapter ? utils.getReaderUrl(chapter.id) : '/';

  return (
    <Link
      to={to}
      className={cx('PillLink x pa-2 lh-1d0', { 'o-50p pe-none': disabled })}>
      {children}
    </Link>
  );
};

export default ReaderChapterLink;
