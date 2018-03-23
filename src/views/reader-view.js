// @flow

import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Subscribe } from 'unstated';

import DotLoader from '../components/loader-dots';
import Dropdown from '../components/dropdown';
import IconArrowLeft from '../components/icon-arrow-left';
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

type State = {
  markAsReadTimer: ?TimeoutID,
};

const MARK_AS_READ_TIMEOUT = 5000;

class ReaderView extends Component<Props, State> {
  state = {
    markAsReadTimer: null,
  };

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
      window.scrollTo(0, 0);
    }

    return;
  }

  componentWillUnmount() {
    if (this.state.markAsReadTimer) {
      clearTimeout(this.state.markAsReadTimer);
    }
  }

  loadData = props => {
    const { collectionSlug, siteId, seriesSlug, chapterSlug, store } = props;

    store.fetchChapterIfNeeded(siteId, seriesSlug, chapterSlug);
    store.fetchSeriesIfNeeded(siteId, seriesSlug);

    if (this.state.markAsReadTimer) {
      clearTimeout(this.state.markAsReadTimer);
    }

    if (collectionSlug) {
      store.fetchCollectionIfNeeded(collectionSlug);
      this.setState({
        markAsReadTimer: setTimeout(
          this.handleMarkChapterAsRead,
          MARK_AS_READ_TIMEOUT,
        ),
      });
    }
  };

  handleMarkChapterAsRead = () => {
    const { collectionSlug, seriesSlug, chapterSlug, store } = this.props;

    if (collectionSlug === null || collectionSlug === undefined) {
      return;
    }

    const collection = store.findCollectionBySlug(collectionSlug);
    const series: Series = store.findSeriesBySlug(seriesSlug);
    const currentChapter: Chapter = series.chapters.find(
      c => c.slug === chapterSlug,
    );
    const currentChapterReadAt = currentChapter.createdAt;
    const latestReadAt = collection.bookmarks[series.id].lastReadAt;

    if (latestReadAt > currentChapterReadAt) {
      return;
    }

    store.markSeriesAsRead(collectionSlug, series.id, currentChapter.createdAt);
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
      <div style={{ backgroundColor: '#000', minHeight: '100vh' }}>
        <div className="p-relative x xj-spaceBetween bgc-black c-white pv-4 ph-3">
          {collectionSlug && (
            <Link
              className="x xa-center o-50p p-relative z-2"
              to={utils.getCollectionUrl(collectionSlug)}>
              <IconArrowLeft width={20} height={20} />
            </Link>
          )}
          {series && (
            <div className="p-fill x xa-center xj-center ta-center">
              <div>
                <div>{series.title}</div>
                <div className="fs-12 o-50p">{series.site.name}</div>
              </div>
            </div>
          )}
          <div />
        </div>
        <ReaderNavigation
          currentCollectionSlug={collectionSlug}
          currentChapter={chapter}
          currentSeries={series}
          onChapterSelectChange={this.handleChapterSelectorChange}
        />
        {isLoading ? (
          <div
            className="x xa-center xj-center ta-center pv-4"
            style={{ height: '100vh' }}>
            <div>
              <div className="mb-4">
                <DotLoader />
              </div>
              <div className="fs-12 c-white o-50p">
                Loading{series ? ` from ${series.site.name}` : ''}
              </div>
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
            <nav className="bgc-black c-white ta-center pv-4 ph-3 fs-14 fs-16-m">
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
                        label: `Chapter ${c.number}`,
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
                <div className="mt-5">
                  <Link
                    className="o-50p"
                    to={utils.getCollectionUrl(collectionSlug)}>
                    <IconArrowLeft width={20} height={20} />
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
