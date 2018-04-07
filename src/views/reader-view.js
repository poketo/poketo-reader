// @flow

import React, { Component, Fragment } from 'react';
import Head from 'react-helmet';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import DotLoader from '../components/loader-dots';
import IconArrowLeft from '../components/icon-arrow-left';
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

    window.scrollTo(0, 0);

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
    const { siteId, seriesSlug, chapterSlug } = match.params;

    if (!collection) {
      return;
    }

    const seriesId = utils.getId(siteId, seriesSlug);
    const chapterId = utils.getId(siteId, seriesSlug, chapterSlug);

    const series: ?Series = seriesById[seriesId];

    if (!series) {
      return;
    }

    const bookmark = collection.bookmarks[series.id];
    const currentChapter: ?Chapter = chaptersById[chapterId];

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

    const seriesId = utils.getId(siteId, seriesSlug);
    const chapterId = utils.getId(siteId, seriesSlug, chapterSlug);

    const chapter: ?Chapter = chaptersById[chapterId];
    const series: ?Series = seriesById[seriesId];

    const seriesChapters = series
      ? series.chapters.map(id => chaptersById[id])
      : null;

    const isLoading = isFetching || !series || !chapter || !chapter.pages;

    return (
      <div className="mh-100vh" style={{ backgroundColor: '#404040' }}>
        {series &&
          chapter && (
            <Head>
              <title>{`${series.title} – Chapter ${chapter.number}`}</title>
            </Head>
          )}
        <div className="p-relative x xj-spaceBetween bgc-black c-white pv-3 ph-3">
          <Link
            className="x xa-center o-50p p-relative z-2"
            to={collectionSlug ? utils.getCollectionUrl(collectionSlug) : '/'}>
            <IconArrowLeft width={20} height={20} />
          </Link>
        </div>
        {series && (
          <div className="c-white pv-4 mh-auto w-90p-m ta-center mw-900">
            <div>
              <div>{series.title}</div>
              <div className="fs-12 o-50p">{series.site.name}</div>
            </div>
          </div>
        )}
        {seriesChapters && (
          <ReaderNavigation
            chapter={chapter}
            collectionSlug={collectionSlug}
            seriesChapters={seriesChapters}
            onChapterSelectChange={this.handleChapterSelectorChange}
          />
        )}
        {isLoading ? (
          <div className="x xa-center xj-center ta-center pv-6">
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
            <div className="pv-4 mh-auto w-90p-m ta-center mw-900">
              {(chapter: Chapter).pages.map(page => (
                <div key={page.id} className="mb-3 mb-4-m">
                  <ReaderPageImage page={page} />
                </div>
              ))}
            </div>
            <nav className="bgc-black c-white ta-center pv-4 ph-3 fs-14 fs-16-m">
              {seriesChapters && (
                <ReaderNavigation
                  chapter={chapter}
                  collectionSlug={collectionSlug}
                  seriesChapters={seriesChapters}
                  onChapterSelectChange={this.handleChapterSelectorChange}
                />
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
