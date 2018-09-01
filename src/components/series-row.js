// @flow

import React from 'react';
import { cx } from 'react-emotion';
import { Link } from 'react-router-dom';
import CoverImage from './series-cover-image';
import Icon from './icon';
import utils from '../utils';
import type { FeedItem } from '../types';

const getLinkTo = (item: FeedItem, slug: string) => {
  if (item.linkTo || item.series.supportsReading === false) {
    return item.linkTo || item.series.url;
  }

  const unreadChapters = utils.getUnreadChapters(
    item.chapters,
    item.lastReadAt,
  );

  const toChapter =
    unreadChapters.length > 0
      ? utils.leastRecentChapter(unreadChapters)
      : utils.mostRecentChapter(item.chapters);

  return `/c/${slug}/read/${toChapter.id}`;
};

type Props = {
  className?: string,
  collectionSlug: string,
  feedItem: FeedItem,
  onOptionsClick: (i: string) => (e: SyntheticEvent<HTMLAnchorElement>) => void,
};

const SeriesRow = ({
  className,
  collectionSlug,
  feedItem: item,
  onOptionsClick,
}: Props) => {
  const to = `/series/${item.series.id}`; //getLinkTo(item, collectionSlug);

  const isExternalLink = to.startsWith('http');
  const Component = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink ? { href: to, target: '_blank' } : { to };

  return (
    <div className={cx('x', className)}>
      <Component
        {...linkProps}
        className="c-pointer x-1 d-block xa-center hover ph-3 pv-3">
        <div className="x-1 mb-2">
          <CoverImage series={item.series} />
        </div>
        <div>
          <div className="fs-14 lh-1d25">{item.series.title}</div>
          <div className="fs-12 o-50p">
            {item.series.site.name}
            {isExternalLink && <Icon name="new-tab" iconSize={12} size={12} />}
          </div>
        </div>
      </Component>
      {/* <button className="pa-3" onClick={onOptionsClick(item.series.id)}>
        <Icon
          name="more-horizontal"
          className="c-gray3"
          iconSize={18}
          size={18}
        />
      </button> */}
    </div>
  );
};

export default SeriesRow;
