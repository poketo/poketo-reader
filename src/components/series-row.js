// @flow

import React from 'react';
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
  <div className="x xa-center xj-spaceBetween xj-start-m ph-3 pv-2">
    <a
      href={linkTo ? linkTo : series.url}
      onClick={onSeriesClick(series.id)}
      target="_blank"
      className="x-m xa-baseline-m xo-1-m">
      <div className="Link">{series.title}</div>
      <div className="mt-1 mt-0-m ml-2-m fs-12 o-50p">
        {utils.formatTimestamp(series.updatedAt)}
      </div>
    </a>
    <div className="x xa-center mr-0 mr-3-m ml-2 ml-0-m xo-0-m">
      <button title="Mark as read" onClick={onMarkAsReadClick(series.id)}>
        <div
          className={`w-16 h-16 br-round ${
            isUnread ? 'bgc-pink' : 'ba-2 bc-extraFadedBlack'
          }`}
        />
      </button>
    </div>
  </div>
);

export default SeriesRow;
