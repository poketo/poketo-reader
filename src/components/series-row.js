// @flow

import React, { Fragment } from 'react';
import utils from '../utils';

import type { Series } from '../types';

type Props = {
  series: Series,
  isUnread: boolean,
  linkToUrl: ?string,
  onMarkAsReadClick: (
    seriesId: string,
  ) => (e: SyntheticEvent<HTMLButtonElement>) => void,
  onOptionsClick: (
    seriesId: string,
  ) => (e: SyntheticEvent<HTMLAnchorElement>) => void,
  onSeriesClick: (
    seriesId: string,
  ) => (e: SyntheticEvent<HTMLButtonElement>) => void,
};

const SeriesRow = ({
  series,
  isUnread,
  linkToUrl,
  onMarkAsReadClick,
  onOptionsClick,
  onSeriesClick,
}: Props) => (
  <div className="SeriesRow x bb-1 bc-lightGray bc-transparent-m">
    <a
      href={linkToUrl ? linkToUrl : series.url}
      onClick={onSeriesClick(series.id)}
      target="_blank"
      className="hover x-1 x xd-column ph-3 pv-3">
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
        {linkToUrl && (
          <Fragment>
            {utils.getDomainName(linkToUrl)}
            <span className="fs-9 ph-1 p-relative t--1">&bull;</span>
          </Fragment>
        )}
        {utils.formatTimestamp(series.updatedAt)}
      </span>
    </a>
    <button className="pa-3" onClick={onOptionsClick(series.id)}>
      &hellip;
    </button>
  </div>
);

export default SeriesRow;
