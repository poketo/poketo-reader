// @flow

import React from 'react';
import classNames from 'classnames';

if (typeof global.window !== 'undefined') {
  global.window.lazySizesConfig = window.lazySizesConfig || {};
  global.window.lazySizesConfig.lazyClass = 'js-lazysizes';
  global.window.lazySizesConfig.preloadClass = 'js-lazysizes-preload';
  global.window.lazySizesConfig.loadedClass = 'js-lazysizes-loaded';
  global.window.lazySizesConfig.expFactor = 1200;
  global.window.lazySizesConfig.expFactor = 2.0;

  require('lazysizes/plugins/attrchange/ls.attrchange.js');
  require('lazysizes');
}

type Props = {
  page: {
    url: string,
    alt?: string,
    width: number,
    height: number,
  },
  preload: boolean,
  fitHeight: boolean,
};

const SeriesPageImage = ({ page, preload, fitHeight }: Props) => {
  const hasSize = page.width && page.height;

  return (
    <span
      className={classNames('PageImage', {
        'PageImage--hasSize': hasSize,
      })}>
      <img
        src="data:image/gif;base64,R0lGODlhAQABAPAAAPLy8v///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
        data-src={page.url}
        alt={page.alt}
        className={`PageImage-image js-lazysizes ${
          preload ? 'js-lazysizes-preload' : ''
        }`}
      />
      <canvas
        className="PageImage-background"
        width={page.width || 800}
        height={page.height || 800}
      />
    </span>
  );
};

SeriesPageImage.defaultProps = {
  preload: false,
  fitHeight: false,
};

export default SeriesPageImage;
