// @flow

import React, { Component, Fragment, type Node } from 'react';
import Head from 'react-helmet';
import BodyClassName from 'react-body-classname';
import { Link, withRouter, type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../components/button';
import DotLoader from '../components/loader-dots';
import Icon from '../components/icon';
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
import type { Dispatch, FetchStatusState } from '../store/types';

type Props = {
  chapter: Chapter | ChapterMetadata,
  chapterId: string,
  chapterStatus: FetchStatusState,
  collection: ?Collection,
  collectionSlug: ?string,
  seriesChapters: Array<Chapter | ChapterMetadata>,
  seriesId: string,
  series: ?Series,
  dispatch: Dispatch,
  history: RouterHistory,
  match: {|
    params: {|
      collectionSlug: ?string,
      siteId: string,
      seriesSlug: string,
      chapterSlug: string,
    |},
  |},
};

class ReaderView extends Component<Props> {
  static mapStateToProps = (state, ownProps: Props) => {
    const { match } = ownProps;
    const { collectionSlug, siteId, seriesSlug, chapterSlug } = match.params;

    const seriesId = utils.getId(siteId, seriesSlug);
    const chapterId = utils.getId(siteId, seriesSlug, chapterSlug);

    const series = state.series[seriesId];

    return {
      chapter: state.chapters[chapterId],
      chapterId,
      chapterStatus: state.chapters._status,
      collection: state.collections[ownProps.match.params.collectionSlug],
      collectionSlug,
      series,
      seriesChapters: series
        ? series.chapters.map(id => state.chapters[id])
        : null,
      seriesId,
    };
  };

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
      this.handleMarkChapterAsRead();
    }
  };

  handleRetryButtonClick = () => {
    this.loadData(this.props);
  };

  handleMarkChapterAsRead = () => {
    const { collection, series, chapter, dispatch } = this.props;

    if (!collection || !series || !chapter) {
      return;
    }

    const bookmark = collection.bookmarks[series.id];
    const currentChapterReadAt = chapter.createdAt;
    const latestReadAt = bookmark.lastReadAt;

    if (latestReadAt > currentChapterReadAt) {
      return;
    }

    dispatch(
      markSeriesAsRead(collection.slug, series.id, currentChapterReadAt),
    );
  };

  handleChapterChange = (nextChapter: Chapter) => {
    const { chapterId: currentChapterId, collectionSlug, history } = this.props;

    if (nextChapter.id === currentChapterId) {
      return;
    }

    const [site, series, chapter] = nextChapter.id.split(':');
    const url = utils.getReaderUrl(collectionSlug, site, series, chapter);

    history.push(url);
  };

  render() {
    const {
      collection,
      collectionSlug,
      chapter,
      chapterStatus,
      series,
      seriesChapters,
    } = this.props;
    const { isFetching, errorCode } = chapterStatus;

    const unreadMap = collection ? utils.getUnreadMap(collection) : {};

    const isLoading = isFetching || !chapter || !chapter.pages;

    return (
      <div className="mh-100vh bgc-gray4">
        {series &&
          chapter && (
            <Head>
              <title>{`${series.title} – Chapter ${
                chapter.chapterNumber
              }`}</title>
            </Head>
          )}
        <BodyClassName className="ff-sans bgc-black" />
        <div className="p-relative x xj-spaceBetween bgc-black c-white pv-3 ph-3">
          <Link
            className="x xa-center o-50p p-absolute z-2"
            to={collectionSlug ? utils.getCollectionUrl(collectionSlug) : '/'}>
            <Icon name="arrow-left" iconSize={20} />
          </Link>
          <div className="c-white mh-auto w-90p ta-center mw-900">
            <div>
              <div>{series ? series.title : ''}&nbsp;</div>
              <div className="fs-12 o-50p">{series && series.site.name}</div>
            </div>
          </div>
        </div>
        {series &&
          seriesChapters && (
            <div className="pt-4">
              <ReaderNavigation
                collection={collection}
                chapter={chapter}
                lastReadAt={unreadMap[series.id]}
                seriesChapters={seriesChapters}
                onChapterSelectChange={this.handleChapterChange}
              />
            </div>
          )}
        {((): Node => {
          if (isLoading || errorCode) {
            return (
              <div className="x xa-center xj-center ta-center pv-6 c-white">
                {errorCode ? (
                  <div>
                    <div className="mb-2 c-white o-50p">
                      <Icon name="warning" />
                    </div>
                    <div className="mb-3 o-50p">
                      Error loading{series ? ` from ${series.site.name}` : ''}
                    </div>
                    <Button inline onClick={this.handleRetryButtonClick}>
                      <span className="ph-3">Retry</span>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <DotLoader />
                    </div>
                    <div className="fs-12 o-50p">
                      Loading{series ? ` from ${series.site.name}` : ''}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <Fragment>
              <div className="pv-4 mh-auto w-90p-m ta-center mw-900">
                {(chapter: Chapter).pages.map(page => (
                  <div key={page.id} className="mb-3 mb-4-m">
                    <ReaderPageImage page={page} />
                  </div>
                ))}
              </div>
              {series &&
                seriesChapters && (
                  <div className="pb-4">
                    <ReaderNavigation
                      chapter={chapter}
                      collection={collection}
                      lastReadAt={unreadMap[series.id]}
                      seriesChapters={seriesChapters}
                      onChapterSelectChange={this.handleChapterChange}
                    />
                  </div>
                )}
              {collection && (
                <nav className="bgc-black c-white ta-center pv-4 fs-14 fs-16-m">
                  <Link
                    className="o-50p"
                    to={utils.getCollectionUrl(collection.slug)}>
                    <Icon name="arrow-left" iconSize={20} />
                  </Link>
                </nav>
              )}
            </Fragment>
          );
        })()}
      </div>
    );
  }
}

export default withRouter(connect(ReaderView.mapStateToProps)(ReaderView));
