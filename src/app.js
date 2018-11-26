// @flow

// $FlowFixMe: Flow doesn't support React 16.6 features yet
import React, { Component, Suspense, lazy } from 'react';
import Head from 'react-helmet';
import BodyClassName from 'react-body-classname';
import { cx } from 'react-emotion/macro';
import { Switch, Redirect, Route } from 'react-router-dom';

import Analytics from './components/analytics';
import AuthRoute from './components/auth-route';
import ErrorBoundary from './components/error-boundary';
import StandaloneStatusBar from './components/standalone-status-bar';
import CircleLoader from './components/loader-circle';

import FeedView from './views/feed-view';
import HomeView from './views/home-view';
import SeriesView from './views/series-view';
import ReaderView from './views/reader-view';
import LogOutView from './views/log-out-view';
import NotFoundView from './views/not-found-view';
import utils from './utils';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles/hibiscss.before.css';
import './styles/base.css';
import './styles/hibiscss.after.css';
import './styles/app.css';

const LazyLogInView = lazy(() => import('./views/log-in-view'));
const LazyAboutView = lazy(() => import('./views/about-view'));
const LazyExportView = lazy(() => import('./views/export-view'));

export default class App extends Component<{}> {
  render() {
    return (
      <div id="app" className="status-bar-ios-offset">
        <Head defaultTitle="Poketo" titleTemplate="%s – Poketo">
          <meta name="description" content="Light and fun manga reader." />
        </Head>
        <BodyClassName
          className={cx('ff-sans c-gray5 bgc-offwhite', {
            'supports-hover': !utils.isTouchDevice(),
          })}
        />
        <Analytics />
        <StandaloneStatusBar />
        <Suspense
          fallback={
            <div className="x xa-center xj-center w-100p h-100p">
              <CircleLoader />
            </div>
          }>
          <ErrorBoundary>
            <Switch>
              <AuthRoute path="/(feed|library)" component={FeedView} />
              <AuthRoute
                exact
                path="/settings/export"
                component={LazyExportView}
              />

              {/* Public routes */}
              <Route path="/series/:seriesId" exact component={SeriesView} />
              <Route path="/read/:chapterId" exact component={ReaderView} />
              <Route path="/logout" component={LogOutView} />
              <Route path="/login" component={LazyLogInView} />
              <Route path="/login/:collectionSlug" component={LazyLogInView} />
              <Route path="/c/:collectionSlug" component={LazyLogInView} />
              <Route path="/about" component={LazyAboutView} />
              <Route path="/home" component={HomeView} />
              <Route path="/" exact component={HomeView} />

              {/* Redirect legacy urls */}
              <Redirect
                from="/c/:collectionSlug/read/:chapterId"
                to="/read/:chapterId"
              />

              <Route component={NotFoundView} />
            </Switch>
          </ErrorBoundary>
        </Suspense>
      </div>
    );
  }
}
