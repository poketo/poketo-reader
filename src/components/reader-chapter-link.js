// @flow

import React, { type Node } from 'react';
import { Link } from 'react-router-dom';
import utils from '../utils';
import type { Chapter } from '../types';

type Props = {
  collectionSlug: ?string,
  siteId: string,
  seriesSlug: string,
  chapter: Chapter,
  children: Node,
};

const ReaderChapterLink = ({
  collectionSlug,
  siteId,
  seriesSlug,
  chapter,
  children,
}: Props) => {
  const disabled = !chapter;
  const to = utils.getReaderUrl(
    collectionSlug,
    siteId,
    seriesSlug,
    chapter && chapter.slug,
  );

  return (
    <Link
      to={to}
      style={{ pointerEvents: disabled ? 'none' : 'auto' }}
      className={disabled ? 'o-50p' : ''}>
      {children}
    </Link>
  );
};

export default ReaderChapterLink;
