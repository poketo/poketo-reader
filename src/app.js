import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'unstated';

import SeriesContainer from './containers/series-container';

import ErrorBoundary from './components/error-boundary';
import HomeView from './views/home-view';
import FeedView from './views/feed-view';
import ReaderView from './views/reader-view';
import NotFoundView from './views/not-found-view';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles.base.css';
import './styles.custom.css';

const series = new SeriesContainer();

export default class App extends Component {
  render() {
    return (
      <Provider inject={[series]}>
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
              <Route path="/:collectionId" component={FeedView} />
              <Route path="/" component={HomeView} />
              <Route component={NotFoundView} />
            </Switch>
          </ErrorBoundary>
        </div>
      </Provider>
    );
  }
}
