// @flow

import React, { Fragment } from 'react';
import classNames from 'classnames';

import Icon from './icon';
import utils from '../utils';
import type { Series } from 'poketo';

type Props = {
  series: Series,
  isUnread: boolean,
  linkTo: ?string,
  onOptionsClick: (i: string) => (e: SyntheticEvent<HTMLAnchorElement>) => void,
  onSeriesClick: (i: string) => (e: SyntheticEvent<HTMLButtonElement>) => void,
};

const SeriesRow = ({
  series,
  isUnread,
  linkTo,
  onOptionsClick,
  onSeriesClick,
}: Props) => {
  const readingUrl = linkTo ? linkTo : series.url;
  const usesExternalReader = linkTo || series.supportsReading === false;

  return (
    <div className="SeriesRow x bb-1 bc-lightGray bc-transparent-m">
      <a
        href={readingUrl}
        onClick={onSeriesClick(series.id)}
        target="_blank"
        className="c-pointer hover x-1 x xd-column ph-3 pv-3">
        <span className="fs-24-m">
          {isUnread && (
            <span className="p-relative t--2 mr-2">
              <span className="d-inlineBlock w-8 h-8 br-round bgc-coral" />
            </span>
          )}
          <span className={classNames({ 'fw-semibold': isUnread })}>
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
