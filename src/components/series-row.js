// @flow

import React, { Fragment } from 'react';
import utils from '../utils';

import type { Series } from '../types';

type Props = {
  series: Series,
  isUnread: boolean,
  linkTo: ?string,
  onMarkAsReadClick: (slug: string) => {},
  onSeriesClick: (slug: string) => {},
};

const SeriesRow = ({
  series,
  isUnread,
  linkTo,
  onMarkAsReadClick,
  onSeriesClick,
}: Props) => (
  <div className="x xa-stretch xj-spaceBetween xj-start-m">
    <a
      href={linkTo ? linkTo : series.url}
      onClick={onSeriesClick(series.id)}
      target="_blank"
      className="ph-3 pv-2 x-1 x-m xa-baseline-m xo-1-m">
      <div>{series.title}</div>
      <div className="ml-2-m fs-12 o-50p">
        {linkTo && (
          <Fragment>
            {utils.getDomainName(linkTo)}
            <span className="fs-9 ph-1 p-relative t--1">&bull;</span>
          </Fragment>
        )}
        {utils.formatTimestamp(series.updatedAt)}
      </div>
    </a>
    {isUnread && (
      <div className="ph-3 pv-2 x xa-center ml-2 ml-0-m xo-0-m">
        <button title="Mark as read" onClick={onMarkAsReadClick(series.id)}>
          <div className="w-16 h-16 br-round bgc-pink" />
        </button>
      </div>
    )}
  </div>
);

export default SeriesRow;
