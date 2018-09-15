// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import CoverImage from './series-cover-image';
import utils from '../utils';
import type { FeedItem } from '../types';

type Props = {
  feedItem: FeedItem,
};

const SeriesRow = ({ feedItem: item, ...props }: Props) => {
  const seriesTo = utils.getSeriesUrl(item.series.id);

  const isExternalLink = seriesTo.startsWith('http');
  const Component = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink
    ? { href: seriesTo, target: '_blank' }
    : { to: seriesTo };

  return (
    <div {...props}>
      <Component
        {...linkProps}
        className="c-pointer x xa-center pa-2 pv-2 hover-bg">
        <CoverImage
          className="mr-2 mr-3-m"
          series={item.series}
          variant="small"
        />
        <div className="xs-1 w-100p of-hidden">
          <div className="fs-16 fs-20-m fw-semibold lh-1d25 of-hidden to-ellipsis ws-noWrap">
            {item.series.title}
          </div>
          <div className="fs-12 o-50p">{item.series.site.name}</div>
        </div>
      </Component>
    </div>
  );
};

export default SeriesRow;
