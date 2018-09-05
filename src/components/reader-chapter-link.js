// @flow

import React, { type Node } from 'react';
import type { ChapterMetadata } from 'poketo';
import { cx } from 'react-emotion';
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
      className={cx('PillLink x pa-2', { 'o-50p': disabled })}
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        lineHeight: '1.0',
      }}>
      {children}
    </Link>
  );
};

export default ReaderChapterLink;
