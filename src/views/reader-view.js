// @flow

import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import DotLoader from '../components/loader-dots';
import Dropdown from '../components/dropdown';
import IconArrowLeft from '../components/icon-arrow-left';
import ReaderChapterLink from '../components/reader-chapter-link';
import ReaderPageImage from '../components/reader-page-image';
import ReaderNavigation from '../components/reader-navigation';
import utils from '../utils';

import { fetchSeriesIfNeeded } from '../store/reducers/series';
import { fetchChapterIfNeeded } from '../store/reducers/chapters';
import {
  fetchCollectionIfNeeded,
  markSeriesAsRead,
} from '../store/reducers/collections';

import type { Collection, Chapter, ChapterMetadata, Series } from '../types';
import type { Dispatch } from '../store/types';

type Props = {
  collection: ?Collection,
  seriesById: { [id: string]: Series },
  chaptersById: { [id: string]: Chapter | ChapterMetadata },
  dispatch: Dispatch,
  history: any,
  match: {
    params: {
      collectionSlug: ?string,
      siteId: string,
      seriesSlug: string,
      chapterSlug: string,
    },
  },
};

type State = {
  markAsReadTimer: ?TimeoutID,
};

const MARK_AS_READ_TIMEOUT = 5000;

class ReaderView extends Component<Props, State> {
  state = {
    markAsReadTimer: null,
  };

  static mapStateToProps = (state, ownProps) => ({
    collection: state.collections[ownProps.match.params.collectionSlug],
    seriesById: state.series,
    chaptersById: state.chapters,
  });

  componentDidMount() {
    this.loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { match } = this.props;
    const { siteId, seriesSlug, chapterSlug } = match.params;
    const { params: nextParams } = nextProps.match;

    if (
      nextParams.siteId !== siteId ||
      nextParams.seriesSlug !== seriesSlug ||
      nextParams.chapterSlug !== chapterSlug
    ) {
      this.loadData(nextProps);
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    if (this.state.markAsReadTimer) {
      clearTimeout(this.state.markAsReadTimer);
    }
  }

  loadData = props => {
    const { match, dispatch } = props;
    const { collectionSlug, siteId, seriesSlug, chapterSlug } = match.params;

    dispatch(fetchChapterIfNeeded(siteId, seriesSlug, chapterSlug));
    dispatch(fetchSeriesIfNeeded(siteId, seriesSlug));

    if (this.state.markAsReadTimer) {
      clearTimeout(this.state.markAsReadTimer);
    }

    if (collectionSlug) {
      dispatch(fetchCollectionIfNeeded(collectionSlug));
      this.setState({
        markAsReadTimer: setTimeout(
          this.handleMarkChapterAsRead,
          MARK_AS_READ_TIMEOUT,
        ),
      });
    }
  };

  handleMarkChapterAsRead = () => {
    const {
      collection,
      seriesById,
      chaptersById,
      match,
      dispatch,
    } = this.props;
    const { seriesSlug, chapterSlug } = match.params;

    if (!collection) {
      return;
    }

    const series: ?Series = utils.findBySlugInDictionary(
      seriesById,
      seriesSlug,
    );

    if (!series) {
      return;
    }

    const bookmark = collection.bookmarks[series.id];
    const currentChapter: ?Chapter = utils
      .getDictionaryValues(chaptersById)
      .find(c => c.slug === chapterSlug && c.url === bookmark.url);

    if (!currentChapter) {
      return;
    }

    const currentChapterReadAt = currentChapter.createdAt;
    const latestReadAt = bookmark.lastReadAt;

    if (latestReadAt > currentChapterReadAt) {
      return;
    }

    dispatch(
      markSeriesAsRead(collection.slug, series.id, currentChapterReadAt),
    );
  };

  handleChapterSelectorChange = (e: SyntheticInputEvent<HTMLSelectElement>) => {
    const { match, history } = this.props;
    const { collectionSlug, siteId, seriesSlug, chapterSlug } = match.params;

    const value = e.currentTarget.value;

    if (value === chapterSlug) {
      return;
    }

    history.push(utils.getReaderUrl(collectionSlug, siteId, seriesSlug, value));
  };

  render() {
    const { match, collection, chaptersById, seriesById } = this.props;
    const { chapterSlug, seriesSlug, siteId, collectionSlug } = match.params;
    const { isFetching } = chaptersById._status;

    const chapterId = [siteId, seriesSlug, chapterSlug].join(':');
    const seriesId = [siteId, seriesSlug].join(':');

    const chapter: ?Chapter = chaptersById[chapterId];
    const series: ?Series = seriesById[seriesId];

    const seriesChapters = series
      ? utils
          .getDictionaryValues(chaptersById)
          .filter(c => c.seriesId === series.id)
      : null;

    const isLoading = isFetching || !series || !chapter || !chapter.pages;

    let chapterIndex;
    let previousChapter: ?Chapter;
    let nextChapter: ?Chapter;

    if (!isLoading && chapter && series && seriesChapters) {
      chapterIndex = seriesChapters.findIndex(c => c.id === chapter.id);
      previousChapter = seriesChapters[chapterIndex + 1] || null;
      nextChapter = seriesChapters[chapterIndex - 1] || null;
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
              {(chapter: Chapter).pages.map(page => (
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
                  {seriesChapters && (
                    <Dropdown
                      value={chapterSlug}
                      onChange={this.handleChapterSelectorChange}
                      options={seriesChapters.map(c => ({
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
                seriesChapters && (
                  <Dropdown
                    value={chapterSlug}
                    onChange={this.handleChapterSelectorChange}
                    options={seriesChapters.map(c => ({
                      value: c.slug,
                      label: `Chapter ${c.slug}`,
                    }))}
                  />
                )
              )}
              {collection && (
                <div className="mt-5">
                  <Link
                    className="o-50p"
                    to={utils.getCollectionUrl(collection.slug)}>
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

export default withRouter(connect(ReaderView.mapStateToProps)(ReaderView));
