import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'unstated';

import EntityContainer from './containers/entity-container';

import ErrorBoundary from './components/error-boundary';
import HomeView from './views/home-view';
import FeedView from './views/feed-view';
import ReaderView from './views/reader-view';
import NotFoundView from './views/not-found-view';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles.base.css';
import './styles.hibiscss.css';
import './styles.custom.css';

const entityStore = new EntityContainer();

export default class App extends Component {
  render() {
    return (
      <Provider inject={[entityStore]}>
        <div id="app">
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
              <Route path="/" exact component={HomeView} />
              <Route component={NotFoundView} />
            </Switch>
          </ErrorBoundary>
        </div>
      </Provider>
    );
  }
}
