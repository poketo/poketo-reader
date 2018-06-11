// @flow

import React, { type Node } from 'react';
import { Link } from 'react-router-dom';

import Button from '../components/button';
import utils from '../utils';
import type { Chapter } from '../types';

type Props = {
  collectionSlug: ?string,
  chapter: ?Chapter,
  children: Node,
};

const ReaderChapterLink = ({ collectionSlug, chapter, children }: Props) => {
  const disabled = !chapter;

  let to = '/';

  if (chapter) {
    const { siteId, seriesSlug } = utils.getIdComponents(chapter.id);
    to = utils.getReaderUrl(
      collectionSlug,
      siteId,
      seriesSlug,
      chapter && chapter.slug,
    );
  }

  return (
    <Button small disabled={disabled}>
      <Link to={to} style={{ pointerEvents: disabled ? 'none' : 'auto' }}>
        {children}
      </Link>
    </Button>
  );
};

export default ReaderChapterLink;
