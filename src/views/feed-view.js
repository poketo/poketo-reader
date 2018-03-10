// @flow

import React, { Component } from 'react';
import { Subscribe } from 'unstated';

import EntityContainer from '../containers/entity-container';
import Button from '../components/button';
import CodeBlock from '../components/code-block';
import Input from '../components/input';
import SeriesRow from '../components/series-row';
import utils from '../utils';

import type { Chapter, Collection, Series } from '../types';

type Props = {
  collectionSlug: string,
  history: any,
  store: any,
};

type State = {
  isSeriesModalOpen: boolean,
  newSeriesUrl: ?string,
};

class FeedView extends Component<Props, State> {
  state = {
    isSeriesModalOpen: false,
    newSeriesUrl: null,
  };

  componentDidMount() {
    const { collectionSlug, store } = this.props;
    store.fetchCollectionIfNeeded(collectionSlug);
  }

  handleAddClick = () => {
    this.setState({ isSeriesModalOpen: true });
  };

  handleAddCancelClick = () => {
    this.setState({ isSeriesModalOpen: false, newSeriesUrl: null });
  };

  handleAddConfirmClick = () => {
    const { collectionSlug, store } = this.props;
    const { newSeriesUrl } = this.state;

    if (!newSeriesUrl) {
      throw new Error('Missing new series URL');
    }

    if (!/^http(s)?:\/\//.test(newSeriesUrl)) {
      throw new Error(`Series URL is not a valid URL!`);
    }

    store.addSeriesToCollection(collectionSlug, newSeriesUrl);
  };

  handleNewSeriesUrlChange = e => {
    this.setState({ newSeriesUrl: e.target.value });
  };

  handleMarkAsReadClick = seriesId => () => {
    const { collectionSlug, store } = this.props;
    const { series } = store.state;

    const seriesSlug = series[seriesId].slug;

    store.markSeriesAsRead(collectionSlug, seriesSlug);
  };

  handleSeriesClick = seriesId => e => {
    const { history, collectionSlug, store } = this.props;

    const collection: Collection = store.state.collections[collectionSlug];
    const series: ?Series = store.state.series[seriesId];

    if (series === null || series === undefined) {
      return;
    }

    store.markSeriesAsRead(collectionSlug, series.slug);

    if (series.supportsReading !== true || series.chapters === undefined) {
      return;
    }

    e.preventDefault();

    const unreadChapters: Array<Chapter> = series.chapters.filter(
      chapter => chapter.createdAt > collection.series[series.id].lastReadAt,
    );

    const toChapter =
      unreadChapters.length > 0
        ? utils.leastRecentChapter(unreadChapters)
        : utils.mostRecentChapter(series.chapters);

    history.push(
      `/${collectionSlug}/read/${series.site.id}/${series.slug}/${
        toChapter.slug
      }`,
    );
  };

  render() {
    const { store, collectionSlug } = this.props;
    const { isSeriesModalOpen } = this.state;
    const { collections, errorMessage, isFetching, isNotFound } = store.state;

    const collection = collections[collectionSlug];
    const series: Array<Series> = Object.values(store.state.series).sort(
      (a: Series, b: Series) => b.updatedAt - a.updatedAt,
    );

    if (isFetching || series.length === 0) {
      return <div>Loading...</div>;
    }

    if (isNotFound) {
      return (
        <div>
          Uh oh. Couldn't find the manga collection at {collectionSlug}.
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div>
          Something went wrong while loading.
          <CodeBlock>{errorMessage}</CodeBlock>
        </div>
      );
    }

    return (
      <div>
        {isSeriesModalOpen && (
          <div className="p-fixed top-0 left-0 right-0 bottom-0 z-9 x xj-center xa-center bgc-fadedBlack">
            <div
              className="pa-4 bgc-white br-4"
              style={{ width: '100%', maxWidth: 400 }}>
              <div className="mb-3">
                <h2 className="fs-20 fw-normal mb-1">Add a new series</h2>
                <p className="fs-14">
                  Paste the series URL from{' '}
                  <a href="https://www.mangaupdates.com/">MangaUpdates</a>, and
                  the link you'd like to read it at.
                </p>
              </div>
              <div className="mb-2">
                <Input
                  type="text"
                  placeholder="Series URL..."
                  onChange={this.handleNewSeriesUrlChange}
                />
              </div>
              <div className="x xj-end mt-3">
                <div>
                  <Button onClick={this.handleAddCancelClick}>Cancel</Button>
                </div>
                <div className="ml-1">
                  <Button onClick={this.handleAddConfirmClick}>Add</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mw-500">
          <div>
            {series.map(s => (
              <div key={s.id} className="mb-3">
                <SeriesRow
                  series={s}
                  isUnread={s.updatedAt > collection.series[s.id].lastReadAt}
                  linkTo={collection.series[s.id].linkTo}
                  onMarkAsReadClick={this.handleMarkAsReadClick}
                  onSeriesClick={this.handleSeriesClick}
                />
              </div>
            ))}
            <div className="p-fixed bottom-16 right-16">
              <Button className="pa-3" onClick={this.handleAddClick}>
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ({ match, history }: any) => (
  <Subscribe to={[EntityContainer]}>
    {store => (
      <FeedView
        collectionSlug={match.params.collectionSlug}
        store={store}
        history={history}
      />
    )}
  </Subscribe>
);
