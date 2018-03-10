// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';

import EntityContainer from '../containers/entity-container';
import SeriesPageImage from '../components/series-page-image';

import type { Chapter } from '../types';

type Props = {
  collectionSlug: ?string,
  siteId: string,
  seriesSlug: string,
  chapterSlug: string,
  store: any,
};

class ReaderView extends Component<Props> {
  componentDidMount() {
    const { siteId, seriesSlug, chapterSlug, store } = this.props;
    store.fetchChapterIfNeeded(siteId, seriesSlug, chapterSlug);
  }

  render() {
    const { chapterSlug, collectionSlug, store } = this.props;
    const { isFetching } = store.state;

    const chapter: ?Chapter = store.findChapterBySlug(chapterSlug);

    const isLoading =
      isFetching ||
      chapter === null ||
      chapter === undefined ||
      chapter.pages === undefined;

    return (
      <div>
        <nav className="x xj-spaceBetween mv-4">
          {collectionSlug ? (
            <Link to={`/${collectionSlug}/`}>&larr; Back</Link>
          ) : (
            <div />
          )}
          {chapter && (
            <Fragment>
              <div>Chapter {chapter.slug}</div>
              <a href={chapter.url} target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </Fragment>
          )}
        </nav>
        {isLoading ? (
          <div className="ta-center pv-4">Loading from the site...</div>
        ) : (
          <Fragment>
            <div className="ta-center">
              {chapter.pages.map(page => (
                <div key={page.id} className="mb-2">
                  <SeriesPageImage page={page} />
                </div>
              ))}
            </div>
            {collectionSlug && (
              <nav className="x xj-center">
                <Link to={`/${collectionSlug}/`}>Back</Link>
              </nav>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default ({ match }: any) => (
  <Subscribe to={[EntityContainer]}>
    {store => (
      <ReaderView
        collectionSlug={match.params.collectionSlug}
        siteId={match.params.siteId}
        seriesSlug={match.params.seriesSlug}
        chapterSlug={match.params.chapterSlug}
        store={store}
      />
    )}
  </Subscribe>
);
