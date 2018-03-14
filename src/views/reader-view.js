// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';

import Spinner from '../components/spinner';
import Dropdown from '../components/dropdown';
import EntityContainer from '../containers/entity-container';
import ReaderChapterLink from '../components/reader-chapter-link';
import ReaderPageImage from '../components/reader-page-image';
import ReaderNavigation from '../components/reader-navigation';
import utils from '../utils';

import type { Chapter, Series } from '../types';

type Props = {
  history: any,
  collectionSlug: ?string,
  siteId: string,
  seriesSlug: string,
  chapterSlug: string,
  store: any,
};

class ReaderView extends Component<Props> {
  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { siteId, seriesSlug, chapterSlug } = this.props;

    if (
      nextProps.siteId !== siteId ||
      nextProps.seriesSlug !== seriesSlug ||
      nextProps.chapterSlug !== chapterSlug
    ) {
      this.loadData(nextProps);
    }

    return;
  }

  loadData = props => {
    const { collectionSlug, siteId, seriesSlug, chapterSlug, store } = props;

    store.fetchChapterIfNeeded(siteId, seriesSlug, chapterSlug);
    store.fetchSeriesIfNeeded(siteId, seriesSlug);

    if (collectionSlug) {
      store.fetchCollectionIfNeeded(collectionSlug);
    }
  };

  handleChapterSelectorChange = (e: SyntheticInputEvent<HTMLSelectElement>) => {
    const {
      collectionSlug,
      siteId,
      seriesSlug,
      chapterSlug,
      history,
    } = this.props;
    const value = e.target.value;

    if (value !== chapterSlug) {
      history.push(
        utils.getReaderUrl(collectionSlug, siteId, seriesSlug, value),
      );
    }
  };

  render() {
    const {
      chapterSlug,
      seriesSlug,
      siteId,
      collectionSlug,
      store,
    } = this.props;

    const chapter: Chapter = store.findChapterBySlug(chapterSlug);
    const series: Series = store.findSeriesBySlug(seriesSlug);
    const isFetching = store.state.chaptersStatus.isFetching;

    const isLoading =
      isFetching ||
      chapter === null ||
      chapter === undefined ||
      chapter.pages === undefined;

    let chapterIndex;
    let previousChapter: ?Chapter = null;
    let nextChapter: ?Chapter = null;

    if (chapter && series) {
      chapterIndex = series.chapters.findIndex(c => c.id === chapter.id);
      previousChapter = series.chapters[chapterIndex + 1] || null;
      nextChapter = series.chapters[chapterIndex - 1] || null;
    }

    return (
      <div style={{ backgroundColor: '#faf8f9', minHeight: '100vh' }}>
        <ReaderNavigation
          currentCollectionSlug={collectionSlug}
          currentChapter={chapter}
          currentSeries={series}
          onChapterSelectChange={this.handleChapterSelectorChange}
        />
        {isLoading ? (
          <div
            className="x xa-center xj-center ta-center pv-5"
            style={{ height: '100vh' }}>
            <div>
              <div className="mb-4">
                <Spinner />
              </div>
              <div>Loading{series ? ` from ${series.site.name}` : ''}</div>
            </div>
          </div>
        ) : (
          <Fragment>
            <div className="pt-5 pb-4 mh-auto w-90p-m ta-center mw-900">
              {chapter.pages.map(page => (
                <div key={page.id} className="mb-3 mb-4-m">
                  <ReaderPageImage page={page} />
                </div>
              ))}
            </div>
            <nav className="ta-center pv-4 ph-3">
              {series ? (
                <div className="x xa-center xj-spaceBetween w-100p">
                  <ReaderChapterLink
                    collectionSlug={collectionSlug}
                    siteId={siteId}
                    seriesSlug={seriesSlug}
                    chapter={previousChapter}>
                    Previous
                  </ReaderChapterLink>
                  {series && (
                    <Dropdown
                      value={chapterSlug}
                      onChange={this.handleChapterSelectorChange}
                      options={series.chapters.map(c => ({
                        value: c.slug,
                        label: `Chapter ${c.slug}`,
                      }))}
                    />
                  )}
                  <ReaderChapterLink
                    collectionSlug={collectionSlug}
                    siteId={siteId}
                    seriesSlug={seriesSlug}
                    chapter={nextChapter}>
                    Next
                  </ReaderChapterLink>
                </div>
              ) : (
                series && (
                  <Dropdown
                    value={chapterSlug}
                    onChange={this.handleChapterSelectorChange}
                    options={series.chapters.map(c => ({
                      value: c.slug,
                      label: `Chapter ${c.slug}`,
                    }))}
                  />
                )
              )}
              {collectionSlug && (
                <div className="mt-4">
                  <Link to={utils.getCollectionUrl(collectionSlug)}>
                    Back to collection
                  </Link>
                </div>
              )}
            </nav>
          </Fragment>
        )}
      </div>
    );
  }
}

export default ({ match, history }: any) => (
  <Subscribe to={[EntityContainer]}>
    {store => (
      <ReaderView
        history={history}
        collectionSlug={match.params.collectionSlug}
        siteId={match.params.siteId}
        seriesSlug={match.params.seriesSlug}
        chapterSlug={match.params.chapterSlug}
        store={store}
      />
    )}
  </Subscribe>
);
