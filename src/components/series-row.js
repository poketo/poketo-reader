// @flow

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
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
  collectionSlug: string,
  feedItem: FeedItem,
  onOptionsClick: (i: string) => (e: SyntheticEvent<HTMLAnchorElement>) => void,
};

const SeriesRow = ({
  collectionSlug,
  feedItem: item,
  onOptionsClick,
}: Props) => {
  const isUnread = false; // item.series.updatedAt > item.lastReadAt;
  const to = getLinkTo(item, collectionSlug);

  const isExternalLink = to.startsWith('http');
  const Component = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink ? { href: to, target: '_blank' } : { to };

  return (
    <div className="SeriesRow x bb-1 bc-lightGray bc-transparent-m">
      <Component
        {...linkProps}
        className="c-pointer hover x-1 x xd-column ph-3 pv-3">
        <span className="fs-24-m">
          {isUnread && (
            <span className="p-relative t--2 mr-2">
              <span className="d-inlineBlock w-8 h-8 br-round bgc-coral" />
            </span>
          )}
          <span className={classNames({ 'fw-semibold': isUnread })}>
            {item.series.title}
          </span>
        </span>
        <span className="fs-12 o-50p">
          {isExternalLink && (
            <Fragment>
              {utils.getDomainName(to)}
              <span className="fs-9 ph-1 p-relative t--1">&bull;</span>
            </Fragment>
          )}
          {utils.formatTimestamp(item.series.updatedAt)}
        </span>
      </Component>
      <button className="pa-3" onClick={onOptionsClick(item.series.id)}>
        <Icon
          name="more-horizontal"
          className="c-gray3"
          iconSize={18}
          size={18}
        />
      </button>
    </div>
  );
};

export default SeriesRow;
