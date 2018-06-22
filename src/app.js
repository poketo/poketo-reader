// @flow

import React, { Component } from 'react';
import Head from 'react-helmet';
import BodyClassName from 'react-body-classname';
import classNames from 'classnames';
import { Switch, Route } from 'react-router-dom';

import Analytics from './components/analytics';
import DeviceStatus from './containers/device-status';
import ErrorBoundary from './components/error-boundary';
import StandaloneStatusBar from './containers/standalone-status-bar';

import AboutView from './views/about-view';
import FeedView from './views/feed-view';
import HomeView from './views/home-view';
import LogInView from './views/log-in-view';
import ReaderView from './views/reader-view';
import NotFoundView from './views/not-found-view';
import utils from './utils';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles/hibiscss.css';
import './styles/base.css';
import './styles/app.css';

export default class App extends Component<{}> {
  render() {
    return (
      <div id="app" className="status-bar-ios-offset">
        <Head defaultTitle="Poketo" titleTemplate="%s – Poketo">
          <meta name="description" content="Light and fun manga reader." />
        </Head>
        <BodyClassName
          className={classNames('ff-sans c-gray5 bgc-offwhite', {
            'supports-hover': !utils.isTouchDevice(),
          })}
        />
        <Analytics />
        <DeviceStatus />
        <StandaloneStatusBar />
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
            <Route path="/login" component={LogInView} />
            <Route path="/about" component={AboutView} />
            <Route path="/home" component={HomeView} />
            <Route path="/" exact component={HomeView} />
            <Route component={NotFoundView} />
          </Switch>
        </ErrorBoundary>
      </div>
    );
  }
}
