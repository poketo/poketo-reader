// @flow

import React, { Component, Fragment } from 'react';
import Head from 'react-helmet';
import BodyClassName from 'react-body-classname';
import { withRouter, type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../components/button';
import DotLoader from '../components/loader-dots';
import Icon from '../components/icon';
import ReaderHeader from '../components/reader-header';
import ReaderPageImageList from '../components/reader-page-image-list';
import ReaderNavigation from '../components/reader-navigation';
import ReaderFooter from '../components/reader-footer';
import utils from '../utils';

import { getCollectionSlug } from '../store/reducers/navigation';
import { fetchSeriesIfNeeded } from '../store/reducers/series';
import { fetchChapterIfNeeded } from '../store/reducers/chapters';
import {
  fetchCollectionIfNeeded,
  markSeriesAsRead,
} from '../store/reducers/collections';

import type { Chapter, ChapterMetadata, Series } from 'poketo';
import type { Collection } from '../types';
import type { Dispatch, FetchStatusState } from '../store/types';

type ContainerProps = {
  chapter: Chapter,
  chapterId: string,
  chapterStatus: FetchStatusState,
  collection: ?Collection,
  collectionSlug: ?string,
  seriesChapters: Array<ChapterMetadata>,
  seriesId: string,
  series: ?Series,
  dispatch: Dispatch,
  history: RouterHistory,
  match: {|
    params: {|
      collectionSlug: ?string,
      chapterId: string,
    |},
  |},
};

class ReaderViewContainer extends Component<ContainerProps> {
  componentDidMount() {
    this.loadData(this.props);
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    const { chapterId } = this.props;
    const { chapterId: prevChapterId } = prevProps;

    if (prevChapterId !== chapterId) {
      this.loadData(this.props);
      window.scrollTo(0, 0);
    }
  }

  loadData = props => {
    const { collectionSlug, chapterId, seriesId, dispatch } = props;

    dispatch(fetchChapterIfNeeded(chapterId));
    dispatch(fetchSeriesIfNeeded(seriesId));

    if (collectionSlug) {
      dispatch(fetchCollectionIfNeeded(collectionSlug));
    }
  };

  handleRetryButtonClick = () => {
    this.loadData(this.props);
  };

  handleMarkAsReadPassive = () => {
    this.markCurrentChapterAsRead();
  };

  handleMarkAsReadClick = () => {
    this.markCurrentChapterAsRead({ allowOlderChapters: true });
  };

  markCurrentChapterAsRead = (
    options: { allowOlderChapters?: boolean } = {},
  ) => {
    const {
      collection,
      series,
      seriesChapters,
      chapter: currentChapter,
      dispatch,
    } = this.props;

    if (!collection || !series || !currentChapter) {
      return;
    }

    if (options.allowOlderChapters !== true) {
      const bookmark = collection.bookmarks[series.id];

      if (!bookmark) {
        return;
      }

      const lastReadChapter = seriesChapters.find(
        c => c.id === bookmark.lastReadChapterId,
      );
      const isOlderChapter =
        lastReadChapter && currentChapter.order <= lastReadChapter.order;

      if (isOlderChapter) {
        return;
      }
    }

    dispatch(
      markSeriesAsRead(collection.slug, series.id, {
        lastReadAt: utils.getTimestamp(),
        lastReadChapterId: currentChapter.id,
      }),
    );
  };

  render() {
    const {
      collection,
      chapter,
      chapterStatus,
      series,
      seriesId,
      seriesChapters,
    } = this.props;
    const { isFetching, errorCode } = chapterStatus;

    const bookmark =
      collection && series
        ? collection.bookmarks && collection.bookmarks[series.id]
        : undefined;
    const isLoading = isFetching || !chapter || !chapter.pages || !series;

    const showNavigation = chapter && series && seriesChapters;

    return (
      <div className="mh-100vh bgc-gray4">
        <BodyClassName className="ff-sans bgc-black" />
        <ReaderHeader
          collection={collection}
          chapter={chapter}
          bookmark={bookmark}
          series={series}
          seriesId={seriesId}
          seriesChapters={seriesChapters}
          onMarkAsReadClick={this.handleMarkAsReadClick}
        />
        {isLoading || errorCode ? (
          <div className="x xa-center xj-center h-100p ta-center pv-6 c-white">
            {errorCode ? (
              <div>
                <div className="mb-2 c-white o-50p">
                  <Icon name="warning" />
                </div>
                <div className="mb-3 o-50p">
                  Error loading
                  {series ? ` from ${series.site.name}` : ''}
                </div>
                <Button inline onClick={this.handleRetryButtonClick}>
                  <span className="ph-3">Try again</span>
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <DotLoader />
                </div>
                <div className="fs-12 o-50p">
                  Loading
                  {series ? ` from ${series.site.name}` : ''}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Fragment>
            {series && (
              <ReaderView
                chapter={chapter}
                series={series}
                onMarkAsRead={this.handleMarkAsReadPassive}
              />
            )}
            {showNavigation && (
              <div className="pb-3">
                <ReaderNavigation
                  series={series}
                  collection={collection}
                  chapter={chapter}
                  bookmark={bookmark}
                  seriesChapters={seriesChapters}
                  showNextPreviousLinks
                />
              </div>
            )}
            <ReaderFooter collectionSlug={collection && collection.slug} />
          </Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps: ContainerProps) {
  const { match } = ownProps;
  const { chapterId: rawChapterId } = match.params;

  const collectionSlug = getCollectionSlug(state);
  const collection = collectionSlug ? state.collections[collectionSlug] : null;
  const chapterId = decodeURIComponent(rawChapterId);
  const seriesId = utils.toSeriesId(chapterId);
  const series: ?Series = state.series[seriesId];

  return {
    chapter: state.chapters[chapterId],
    chapterId,
    chapterStatus: state.chapters._status,
    collection,
    collectionSlug,
    series,
    seriesChapters:
      series && series.chapters
        ? series.chapters.map(id => state.chapters[id])
        : null,
    seriesId,
  };
}

type Props = {
  chapter: Chapter,
  series: Series,
  onMarkAsRead: () => void,
};

class ReaderView extends Component<Props> {
  timerId: ?TimeoutID = null;
  timeout = 5000;

  componentDidMount() {
    this.timerId = setTimeout(this.handleMarkAsReadTimeout, this.timeout);
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  handleMarkAsReadTimeout = () => {
    this.props.onMarkAsRead();
  };

  render() {
    const { chapter, series } = this.props;

    const chapterLabel = utils.getChapterLabel(chapter, true);

    return (
      <Fragment>
        <Head>
          <title>{`${series.title} – ${chapterLabel}`}</title>
        </Head>
        <div className="pt-5 pb-4 mh-auto w-90p-m ta-center mw-900">
          <div className="pt-4">
            <ReaderPageImageList pages={chapter.pages} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(connect(mapStateToProps)(ReaderViewContainer));
