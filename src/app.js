// @flow

import React, { Component } from 'react';
import Head from 'react-helmet';
import { Switch, Route } from 'react-router-dom';

import NationalRegular from './assets/fonts/NationalWeb-Regular.woff2';
import NationalRegularItalic from './assets/fonts/NationalWeb-RegularItalic.woff2';
import NationalMedium from './assets/fonts/NationalWeb-Medium.woff2';

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

export default class App extends Component<{}> {
  render() {
    return (
      <div id="app">
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
