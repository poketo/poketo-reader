// @flow

import React, { Component, Fragment, type Node } from 'react';
import Head from 'react-helmet';
import BodyClassName from 'react-body-classname';
import { Link, withRouter } from 'react-router-dom';
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

class ReaderView extends Component<Props> {
  static mapStateToProps = (state, ownProps) => ({
    collection: state.collections[ownProps.match.params.collectionSlug],
    seriesById: state.series,
    chaptersById: state.chapters,
  });

  componentDidMount() {
    this.loadData(this.props);
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props.match;
    const { params: prevParams } = prevProps.match;

    if (
      prevParams.siteId !== params.siteId ||
      prevParams.seriesSlug !== params.seriesSlug ||
      prevParams.chapterSlug !== params.chapterSlug
    ) {
      this.loadData(this.props);
      window.scrollTo(0, 0);
    }
  }

  loadData = props => {
    const { match, dispatch } = props;
    const { collectionSlug, siteId, seriesSlug, chapterSlug } = match.params;

    dispatch(fetchChapterIfNeeded(siteId, seriesSlug, chapterSlug));
    dispatch(fetchSeriesIfNeeded(siteId, seriesSlug));

    if (collectionSlug) {
      dispatch(fetchCollectionIfNeeded(collectionSlug));
      this.handleMarkChapterAsRead();
    }
  };

  handleRetryButtonClick = () => {
    this.loadData(this.props);
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

  handleChapterChange = (chapter: Chapter) => {
    const { match, history } = this.props;
    const { collectionSlug, chapterSlug, siteId, seriesSlug } = match.params;
    const currentChapterId = utils.getId(siteId, seriesSlug, chapterSlug);

    if (chapter.id === currentChapterId) {
      return;
    }

    history.push(
      utils.getReaderUrl(collectionSlug, siteId, seriesSlug, chapter.slug),
    );
  };

  render() {
    const { match, collection, chaptersById, seriesById } = this.props;
    const { chapterSlug, seriesSlug, siteId, collectionSlug } = match.params;
    const { isFetching, errorCode } = chaptersById._status;

    const seriesId = utils.getId(siteId, seriesSlug);
    const chapterId = utils.getId(siteId, seriesSlug, chapterSlug);

    const chapter: ?Chapter = chaptersById[chapterId];
    const series: ?Series = seriesById[seriesId];

    const unreadMap = collection ? utils.getUnreadMap(collection) : {};

    const seriesChapters = series
      ? series.chapters.map(id => chaptersById[id])
      : null;

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
