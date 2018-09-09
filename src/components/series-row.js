// @flow

import React from 'react';
import { cx } from 'react-emotion';
import { Link } from 'react-router-dom';
import CoverImage from './series-cover-image';
import Icon from './icon';
import utils from '../utils';
import type { FeedItem } from '../types';

type Props = {
  className?: string,
  collectionSlug: string,
  feedItem: FeedItem,
};

const SeriesRow = ({ className, collectionSlug, feedItem: item }: Props) => {
  const seriesTo = utils.getSeriesUrl(item.series.id);

  const lastChapter = utils.lastReadChapter(
    item.chapters,
    item.lastReadChapterId,
  );
  const nextChapter = utils.nextChapterToRead(
    item.chapters,
    item.lastReadChapterId,
  );
  const chapterTo = nextChapter ? utils.getReaderUrl(nextChapter.id) : '/';

  const isExternalLink = seriesTo.startsWith('http');
  const Component = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink
    ? { href: seriesTo, target: '_blank' }
    : { to: seriesTo };

  return (
    <div
      className={cx('x xa-stretch', className, {
        'o-50p': item.isCaughtUp,
      })}>
      <Component
        {...linkProps}
        className="c-pointer x x-1 xa-center ph-2 pv-2 hover-bg">
        <div className="mr-2 mr-3-m" css="max-width: 50px; flex: 1 0 50px;">
          <CoverImage series={item.series} />
        </div>
        <div>
          <div className="fs-14 fs-18-m lh-1d25">{item.series.title}</div>
          <div className="fs-12 fs-14-m o-50p">
            {item.series.site.name}
            {isExternalLink && <Icon name="new-tab" iconSize={12} size={12} />}
          </div>
        </div>
      </Component>
      {nextChapter && (
        <Link
          to={chapterTo}
          className="x xa-center fs-12 fs-14-m ph-3 pv-2 hover-bg">
          {lastChapter.chapterNumber} / {item.chapters[0].chapterNumber}
        </Link>
      )}
    </div>
  );
};

export default SeriesRow;
