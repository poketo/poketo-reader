// @flow

import React, { Component, Fragment, type Node } from 'react';
import Head from 'react-helmet';
import BodyClassName from 'react-body-classname';
import { Link, withRouter, type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../components/button';
import DotLoader from '../components/loader-dots';
import Icon from '../components/icon';
import Popover from '../components/popover';
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
      chapterId: string,
    |},
  |},
};

class ReaderView extends Component<Props> {
  static mapStateToProps = (state, ownProps: Props) => {
    const { match } = ownProps;
    const { collectionSlug, chapterId: rawChapterId } = match.params;

    const chapterId = decodeURIComponent(rawChapterId);
    const seriesId = utils.toSeriesId(chapterId);
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
      this.markSeriesAsRead();
    }
  };

  handleRetryButtonClick = () => {
    this.loadData(this.props);
  };

  markSeriesAsRead = () => {
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

    const url = utils.getReaderUrl(collectionSlug, nextChapter.id);

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
              <title>{`${series.title} – ${utils.getChapterLabel(
                chapter,
                true,
              )}`}</title>
            </Head>
          )}
        <BodyClassName className="ff-sans bgc-black" />
        <div className="p-relative x xj-spaceBetween bgc-black c-white pv-3 ph-3">
          <Link
            className="x xa-center o-50p z-2"
            to={collectionSlug ? utils.getCollectionUrl(collectionSlug) : '/'}>
            <Icon name="arrow-left" iconSize={20} />
          </Link>
          <Popover
            content={
              <div className="pa-2" style={{ maxWidth: '80vw' }}>
                {series && (
                  <Popover.Item
                    iconBefore={<Icon name="new-tab" iconSize={24} size={44} />}
                    label={`Open on ${series.site.name}`}
                    href={chapter.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  />
                )}
                <Popover.Item
                  iconBefore={<Icon name="flag" iconSize={24} size={44} />}
                  label="Report a bug"
                />
              </div>
            }
            position={Popover.Position.BOTTOM_RIGHT}>
            <button className="x xa-center o-50p z-2">
              <Icon name="more-vertical" iconSize={20} />
            </button>
          </Popover>
        </div>
        {chapter &&
          series &&
          seriesChapters && (
            <div className="pt-3">
              <ReaderNavigation
                collection={collection}
                chapter={chapter}
                lastReadAt={unreadMap[series.id]}
                onChapterSelectChange={this.handleChapterChange}
                seriesChapters={seriesChapters}
                seriesSiteName={series.site.name}
                seriesTitle={series.title}
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
              {chapter &&
                series &&
                seriesChapters && (
                  <div className="pb-3">
                    <ReaderNavigation
                      chapter={chapter}
                      collection={collection}
                      lastReadAt={unreadMap[series.id]}
                      onChapterSelectChange={this.handleChapterChange}
                      seriesChapters={seriesChapters}
                      seriesTitle={series.title}
                      seriesSiteName={series.site.name}
                    />
                  </div>
                )}
              {collection && (
                <nav className="x xj-spaceBetween bgc-black c-white ta-center pv-4 ph-3 fs-14 fs-16-m">
                  <Link
                    className="o-50p"
                    to={utils.getCollectionUrl(collection.slug)}>
                    <Icon name="arrow-left" iconSize={20} />
                  </Link>
                  <div />
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
