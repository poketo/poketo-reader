import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Provider } from 'unstated';

import CollectionContainer from './containers/collection-container';
import ChapterContainer from './containers/chapter-container';

import ErrorBoundary from './components/error-boundary';
import HomeView from './views/home-view';
import FeedView from './views/feed-view';
import ReaderView from './views/reader-view';
import NotFoundView from './views/not-found-view';

import '@rosszurowski/vanilla/lib/vanilla.css';
import './styles.base.css';
import './styles.custom.css';

const collectionStore = new CollectionContainer();
const chapterStore = new ChapterContainer();

export default class App extends Component {
  render() {
    return (
      <Provider inject={[collectionStore, chapterStore]}>
        <div id="app" className="pa-3 pa-5-m">
          <header className="mb-4">
            <span role="img" aria-label="Tag">
              🔖
            </span>
          </header>
          <ErrorBoundary>
            <Switch>
              <Route
                path="/:collectionSlug/read/:seriesSlug/:chapterSlug+"
                component={ReaderView}
              />
              <Route path="/:collectionSlug" component={FeedView} />
              <Route path="/" component={HomeView} />
              <Route component={NotFoundView} />
            </Switch>
          </ErrorBoundary>
        </div>
      </Provider>
    );
  }
}
