// @flow

import React, { Fragment } from 'react';
import IconMoreHorizontal from './icon-more-horizontal';
import utils from '../utils';

import type { Series } from '../types';

type Props = {
  series: Series,
  isUnread: boolean,
  linkToUrl: ?string,
  onOptionsClick: (i: string) => (e: SyntheticEvent<HTMLAnchorElement>) => void,
  onSeriesClick: (i: string) => (e: SyntheticEvent<HTMLButtonElement>) => void,
};

const SeriesRow = ({
  series,
  isUnread,
  linkToUrl,
  onOptionsClick,
  onSeriesClick,
}: Props) => {
  const readingUrl = linkToUrl ? linkToUrl : series.url;
  const usesExternalReader = linkToUrl || series.supportsReading === false;

  return (
    <div className="SeriesRow x bb-1 bc-lightGray bc-transparent-m">
      <a
        href={readingUrl}
        onClick={onSeriesClick(series.id)}
        target="_blank"
        className="hover x-1 x xd-column ph-3 pv-3">
        <span className="fs-20-m">
          {isUnread && (
            <span className="p-relative t--2 mr-2">
              <span className="d-inlineBlock w-8 h-8 br-round bgc-pink" />
            </span>
          )}
          <span className={isUnread ? 'fw-medium' : undefined}>
            {series.title}
          </span>
        </span>
        <span className="fs-12 o-50p">
          {usesExternalReader && (
            <Fragment>
              {utils.getDomainName(readingUrl)}
              <span className="fs-9 ph-1 p-relative t--1">&bull;</span>
            </Fragment>
          )}
          {utils.formatTimestamp(series.updatedAt)}
        </span>
      </a>
      <button className="pa-3" onClick={onOptionsClick(series.id)}>
        <IconMoreHorizontal />
      </button>
    </div>
  );
};

export default SeriesRow;
