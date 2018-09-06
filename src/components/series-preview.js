// @flow

import React, { Fragment } from 'react';
import type { Series } from 'poketo';
import CoverImage from './series-cover-image';
import DotLoader from './loader-dots';

type Props = {
  series: ?Series,
  isFetching: boolean,
};

const SeriesPreview = ({ series, isFetching }: Props) => (
  <div className="x xa-center pa-3 ba-1 bc-gray1 e-1 br-4">
    {isFetching && (
      <div className="w-100p ta-center">
        <div className="mb-2">
          <DotLoader />
        </div>
        <div className="fs-12 c-gray3">Loading preview</div>
      </div>
    )}
    {!isFetching &&
      series && (
        <Fragment>
          <div className="mr-3" css="flex: 1 0 50%; max-width: 80px;">
            <CoverImage series={series} />
          </div>
          <div>
            <h3 className="fs-18 fw-semibold lh-1d25">{series.title}</h3>
            <h4 className="fs-14 c-gray3">{series.site.name}</h4>
          </div>
        </Fragment>
      )}
  </div>
);

export default SeriesPreview;
