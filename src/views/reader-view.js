// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';

import ChapterContainer from '../containers/chapter-container';
import SeriesPageImage from '../components/series-page-image';

import type { Chapter } from '../types';

type Props = {
  collectionSlug: string,
  seriesSlug: string,
  chapterSlug: string,
  store: any,
};

class ReaderView extends Component<Props> {
  componentDidMount() {
    const { collectionSlug, seriesSlug, chapterSlug, store } = this.props;
    store.fetchChapter(collectionSlug, seriesSlug, chapterSlug);
  }

  render() {
    const { chapterSlug, collectionSlug, store } = this.props;
    const { chapters, isFetching } = store.state;

    const chapter: Chapter = Object.values(chapters).find(
      (chapter: Chapter) => chapter.slug === chapterSlug,
    );
    const isLoading = isFetching || chapter === null || chapter === undefined;

    return (
      <div>
        <nav className="x xj-spaceBetween mv-4">
          <Link to={`/${collectionSlug}/`}>&larr; Back</Link>
          {chapter && (
            <a
              href={chapter.sourceUrl}
              target="_blank"
              rel="noopener noreferrer">
              Open
            </a>
          )}
        </nav>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Fragment>
            <div className="ta-center">
              {chapter.pages.map(page => (
                <div key={page.id} className="mb-2">
                  <SeriesPageImage page={page} />
                </div>
              ))}
            </div>
            <nav className="x xj-center">
              <Link to={`/${collectionSlug}/`}>Back</Link>
            </nav>
          </Fragment>
        )}
      </div>
    );
  }
}

export default ({ match }: any) => (
  <Subscribe to={[ChapterContainer]}>
    {store => (
      <ReaderView
        collectionSlug={match.params.collectionSlug}
        seriesSlug={match.params.seriesSlug}
        chapterSlug={match.params.chapterSlug}
        store={store}
      />
    )}
  </Subscribe>
);
