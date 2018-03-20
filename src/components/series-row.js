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
  <div className="SeriesRow bb-1 bc-lightGray bc-transparent-m">
    <a
      href={linkTo ? linkTo : series.url}
      onClick={onSeriesClick(series.id)}
      target="_blank"
      className="hover x xd-column ph-3 pv-3">
      <span className="fs-20-m">
        {isUnread && (
          <span className="p-relative t--2 mr-2">
            <button title="Mark as read" onClick={onMarkAsReadClick(series.id)}>
              <span className="d-inlineBlock w-8 h-8 br-round bgc-pink" />
            </button>
          </span>
        )}
        <span className={isUnread ? 'fw-medium' : undefined}>
          {series.title}
        </span>
      </span>
      <span className="fs-12 o-50p">
        {linkTo && (
          <Fragment>
            {utils.getDomainName(linkTo)}
            <span className="fs-9 ph-1 p-relative t--1">&bull;</span>
          </Fragment>
        )}
        {utils.formatTimestamp(series.updatedAt)}
      </span>
    </a>
  </div>
);

export default SeriesRow;
