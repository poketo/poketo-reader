// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import Button from './button';
import Icon from './icon';
import CoverImage from './series-cover-image';
import utils from '../utils';
import type { FeedItem } from '../types';

type Props = {
  feedItem: FeedItem,
  onMoreClick: (seriesId: string) => void,
};

const SeriesRow = ({ feedItem: item, onMoreClick, ...props }: Props) => {
  const seriesTo = utils.getSeriesUrl(item.series.id);

  const isExternalLink = seriesTo.startsWith('http');
  const Component = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink
    ? { href: seriesTo, target: '_blank' }
    : { to: seriesTo };

  return (
    <div className="x xa-stretch" {...props}>
      <Component
        {...linkProps}
        className="c-pointer x xa-center x-1 pa-2 pv-2 hover-bg" style={{ width: 'auto', minWidth: 0 }}>
        <CoverImage
          className="mr-2 mr-3-m"
          series={item.series}
          variant="small"
        />
        <div className="of-hidden">
          <div className="fs-16 fs-20-m fw-semibold lh-1d25 of-hidden to-ellipsis ws-noWrap">
            {item.title}
          </div>
          <div className="fs-12 fs-14-m o-50p">{item.series.site.name}</div>
        </div>
      </Component>
      <Button
        inline
        style={{ height: 'auto', minWidth: '44px' }}
        onClick={() => onMoreClick(item.series.id)}>
        <Icon name="more-horizontal" size={20} iconSize={32} />
      </Button>
    </div>
  );
};

SeriesRow.defaultProps = {
  onMoreClick: () => {},
};

export default SeriesRow;
