// @flow

import React, { PureComponent } from 'react';
import { cx, css } from 'react-emotion/macro';
import Button from './button';
import Icon from './icon';

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

const styles = {
  container: css`
    display: inline-block;
    position: relative;
    min-height: 50px;
  `,
  image: css`
    position: absolute;
    opacity: 0;
    transition: opacity 200ms ease;
    vertical-align: top;

    &.js-lazysizes-loaded {
      position: static;
      opacity: 1;
    }
  `,
  background: css`
    vertical-align: top;

    .js-lazysizes-loaded + & {
      display: none;
    }
  `,
};

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

    return (
      <span className={styles.container}>
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
            className={cx(styles.image, 'js-lazysizes')}
          />
        )}
        <canvas
          className={cx(styles.background, 'bgc-gray3')}
          width={width}
          height={height}
        />
      </span>
    );
  }
}
