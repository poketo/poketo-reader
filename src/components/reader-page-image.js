// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
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
    alt?: string,
    width: number,
    height: number,
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

  handleLoad = () => {
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
        className={classNames('PageImage', {
          'PageImage--hasSize': hasSize,
          'PageImage--hasError': hasError,
        })}>
        {hasError ? (
          <div className="p-absolute p-center">
            <Button noPadding inline onClick={this.handleRetryClick}>
              <Icon name="refresh" iconSize={16} size={44} />
              <span className="pr-3">Retry</span>
            </Button>
          </div>
        ) : (
          <img
            src="data:image/gif;base64,R0lGODlhAQABAPAAAPLy8v///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
            data-src={page.url}
            alt={page.alt}
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
