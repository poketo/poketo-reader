// @flow

import React, { PureComponent } from 'react';
import { cx } from 'react-emotion';
import Button from './button';
import Icon from './icon';
import './reader-page-image.css';

if (typeof global.window !== 'undefined') {
  global.window.lazySizesConfig = window.lazySizesConfig || {};
  global.window.lazySizesConfig.lazyClass = 'js-lazysizes';
  global.window.lazySizesConfig.loadingClass = 'js-lazysizes-loading';
  global.window.lazySizesConfig.loadedClass = 'js-lazysizes-loaded';
  global.window.lazySizesConfig.preloadClass = 'js-lazysizes-preload';
  global.window.lazySizesConfig.expFactor = 2.0;

  require('lazysizes/plugins/attrchange/ls.attrchange.js');
  require('lazysizes');
}

type Props = {
  page: {
    url: string,
    width?: number,
    height?: number,
  },
};

type State = {
  hasError: boolean,
};

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 1050;

export default class ReaderPageImage extends PureComponent<Props, State> {
  state = {
    hasError: false,
  };

  handleError = (err: SyntheticEvent<HTMLImageElement>) => {
    this.setState({ hasError: true });
  };

  handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    this.setState({ hasError: false });
  };

  handleRetryClick = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    this.setState({ hasError: false });
  };

  render() {
    const { page } = this.props;
    const { hasError } = this.state;
    const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = page;

    const hasSize = Boolean(page.width) && Boolean(page.height);

    return (
      <span
        className={cx('PageImage', {
          'PageImage--hasSize': hasSize,
          'PageImage--hasError': hasError,
        })}>
        {hasError ? (
          <div className="p-absolute p-center">
            <Button noPadding inline onClick={this.handleRetryClick}>
              <Icon name="refresh" iconSize={16} size={44} />
              <span className="pr-3">Try again</span>
            </Button>
          </div>
        ) : (
          <img
            src="data:image/gif;base64,R0lGODlhAQABAPAAAPLy8v///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
            data-src={page.url}
            alt=""
            onError={this.handleError}
            onLoad={this.handleLoad}
            className="PageImage-image js-lazysizes"
          />
        )}
        <canvas
          className="PageImage-background bgc-gray3"
          width={width}
          height={height}
        />
      </span>
    );
  }
}
