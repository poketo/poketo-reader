// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import utils from '../utils';
import type { Chapter } from '../types';

type Props = {
  collectionSlug: ?string,
  chapter: ?Chapter,
  children: Node,
};

const ReaderChapterLink = ({ collectionSlug, chapter, children }: Props) => {
  const disabled = !chapter;

  const to = chapter ? utils.getReaderUrl(collectionSlug, chapter.id) : '/';

  return (
    <Link
      to={to}
      className={classNames('PillLink x pa-2', { 'o-50p': disabled })}
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
        lineHeight: '1.0',
      }}>
      {children}
    </Link>
  );
};

export default ReaderChapterLink;
