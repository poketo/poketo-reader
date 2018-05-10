// @flow

import React, { Component } from 'react';
import Head from 'react-helmet';
import classNames from 'classnames';
import { Switch, Route } from 'react-router-dom';

import NationalRegular from './assets/fonts/NationalWeb-Regular.woff2';
import NationalRegularItalic from './assets/fonts/NationalWeb-RegularItalic.woff2';
import NationalMedium from './assets/fonts/NationalWeb-Medium.woff2';

import utils from './utils';

import ErrorBoundary from './components/error-boundary';
import AboutView from './views/about-view';
import HomeView from './views/home-view';
import FeedView from './views/feed-view';
import ReaderView from './views/reader-view';
import NotFoundView from './views/not-found-view';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles.base.css';
import './styles.hibiscss.css';
import './styles.custom.css';

const preloadFonts = [NationalRegular, NationalRegularItalic, NationalMedium];

type Props = {};
type State = {
  isStandalone: boolean,
  isAppleDevice: boolean,
  orientation: 'portrait' | 'landscape',
};

export default class App extends Component<Props, State> {
  state = {
    isStandalone: utils.isStandalone(),
    isAppleDevice: utils.isAppleDevice(),
    orientation: 'portrait',
  };

  componentDidMount() {
    window.addEventListener('orientationchange', this.handleOrientationChange);
    this.handleOrientationChange();
  }

  componentWillUnmount() {
    window.removeEventListener(
      'orientationchange',
      this.handleOrientationChange,
    );
  }

  handleOrientationChange = () => {
    const orientation =
      Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
    this.setState({ orientation });
  };

  render() {
    const { isStandalone, isAppleDevice, orientation } = this.state;
    const showCustomStatusBar = isAppleDevice && orientation === 'portrait';

    return (
      <div
        id="app"
        className={classNames({
          'standalone-status-bar-offset': isStandalone,
        })}>
        <Head defaultTitle="Poketo" titleTemplate="%s – Poketo">
          <meta name="description" content="Light and fun manga reader." />
          <body className="ff-sans c-gray5 bgc-offwhite" />
          {preloadFonts.map(href => (
            <link
              key={href}
              rel="preload"
              href={href}
              as="font"
              type="font/woff2"
              crossorigin
            />
          ))}
        </Head>
        {isStandalone &&
          (showCustomStatusBar ? (
            <div className="StatusBar p-fixed t-0 l-0 r-0 z-10 bgc-black" />
          ) : (
            <style>{`.standalone-status-bar-offset { padding-top: 0 !important; }`}</style>
          ))}
        <ErrorBoundary>
          <Switch>
            <Route
              path="/read/:siteId/:seriesSlug/:chapterSlug+"
              component={ReaderView}
            />
            <Route
              path="/c/:collectionSlug/read/:siteId/:seriesSlug/:chapterSlug+"
              component={ReaderView}
            />
            <Route path="/c/:collectionSlug" component={FeedView} />
            <Route path="/about" component={AboutView} />
            <Route path="/" exact component={HomeView} />
            <Route component={NotFoundView} />
          </Switch>
        </ErrorBoundary>
      </div>
    );
  }
}
