import React, { Component } from 'react';
import Head from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import ErrorBoundary from './components/error-boundary';
import AboutView from './views/about-view';
import HomeView from './views/home-view';
import FeedView from './views/feed-view';
import ReaderView from './views/reader-view';
import NotFoundView from './views/not-found-view';

import store from './store';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles.base.css';
import './styles.hibiscss.css';
import './styles.custom.css';

Raven.config(
  'https://619b7bd7891f4ecf8ded60b0da497379@sentry.io/647039',
).install();

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div id="app">
          <Head defaultTitle="Poketo" titleTemplate="%s – Poketo">
            <meta name="description" content="Light and fun manga reader." />
            <body className="ff-sans" />
          </Head>
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
      </Provider>
    );
  }
}
