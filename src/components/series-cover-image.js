// @flow

import React from 'react';
import classNames from 'classnames';
import './series-cover-image.css';

type Props = {
  className?: string,
  series: {
    coverImageUrl: ?string,
    title: string,
  },
};

const SeriesCoverImage = ({ className, series }: Props) => (
  <div
    className={classNames('SeriesCoverImage', className)}
    role="img"
    aria-label={series.title}>
    {series.coverImageUrl && (
      <div
        className="SeriesCoverImage-img"
        style={{ backgroundImage: `url(${series.coverImageUrl})` }}
      />
    )}
  </div>
);

export default SeriesCoverImage;
