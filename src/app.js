import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ErrorBoundary from './components/error-boundary';
import FeedView from './views/feed-view';
import ReaderView from './views/reader-view';
import NotFoundView from './views/not-found-view';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles.base.css';
import './styles.custom.css';

export default class App extends Component {
  render() {
    return (
      <div id="app" className="pa-3 pa-5-m">
        <header className="mb-4">
          <span role="img" aria-label="Tag">
            🔖
          </span>
        </header>
        <ErrorBoundary>
          <Switch>
            <Route
              path="/:collectionId/read/:seriesId/:chapterId+"
              component={ReaderView}
            />
            <Route path="/:collectionId?" component={FeedView} />
            <Route component={NotFoundView} />
          </Switch>
        </ErrorBoundary>
      </div>
    );
  }
}
