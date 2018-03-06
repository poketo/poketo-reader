// @flow

import React from 'react';
import utils from '../utils';

import type { Series } from '../types';

type Props = {
  series: Series,
  onMarkAsReadClick: (slug: string) => {},
  onSeriesClick: (slug: string) => {},
};

const SeriesRow = ({ series, onMarkAsReadClick, onSeriesClick }: Props) => (
  <div className="x xa-center">
    <div className="x xa-center mr-3">
      <button title="Mark as read" onClick={onMarkAsReadClick(series.slug)}>
        <div
          className={`w-16 h-16 br-round ${
            utils.hasNewChapter(series) ? 'bgc-pink' : 'ba-2 bc-extraFadedBlack'
          }`}
        />
      </button>
    </div>
    <a
      href={series.linkTo ? series.linkTo : series.url}
      onClick={onSeriesClick(series.slug)}
      target="_blank"
      className="x-m xa-baseline-m">
      <div className="Link">{series.title}</div>
      <div className="mt-1 mt-0-m ml-2-m fs-12 o-50p">
        {utils.formatTimestamp(series.updatedAt)}
      </div>
    </a>
  </div>
);

export default SeriesRow;
