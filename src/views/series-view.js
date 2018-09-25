// @flow

import React, { Component, Fragment } from 'react';
import Head from 'react-helmet';
import { cx } from 'react-emotion';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchSeriesIfNeeded } from '../store/reducers/series';
import Button from '../components/button';
import CoverImage from '../components/series-cover-image';
import CircleLoader from '../components/loader-circle';
import ChapterRow from '../components/chapter-row';
import FollowButton from '../components/follow-button';
import ScrollReset from '../components/scroll-reset';
import TextExcerpt from '../components/text-excerpt';
import Icon from '../components/icon';
import Popover from '../components/popover';
import utils from '../utils';
import { markSeriesAsRead } from '../store/reducers/collections';
import type { Dispatch } from '../store/types';
import type { Series, Chapter } from '../types';

type ContainerProps = {
  dispatch: Dispatch,
  isFetching: boolean,
  errorCode: string,
  match: Object,
};

class SeriesPageContainer extends Component<ContainerProps> {
  componentDidMount() {
    const { match, dispatch } = this.props;
    dispatch(fetchSeriesIfNeeded(match.params.seriesId));
  }

  componentDidUpdate(prevProps) {
    const { match: prevMatch } = prevProps;
    const { match, dispatch } = this.props;

    if (prevMatch.params.seriesId !== match.params.seriesId) {
      dispatch(fetchSeriesIfNeeded(match.params.seriesId));
    }
  }

  render() {
    if (this.props.errorCode) {
      return this.props.errorCode;
    }

    if (this.props.isFetching) {
      return (
        <div className="x xj-center xa-center mh-100vh">
          <CircleLoader />
        </div>
      );
    }

    return <ConnectedSeriesPage seriesId={this.props.match.params.seriesId} />;
  }
}

const Label = ({ className, ...props }: { className?: string }) => (
  <div className={cx(className, 'fs-14 c-gray3 mb-1')} {...props} />
);

const iconProps = {
  iconSize: 20,
  size: 44,
};

type Props = {
  series: Series,
  chapters: Chapter[],
  collectionSlug: ?string,
  lastReadChapterId: ?string,
  markAsRead: (
    collectionSlug: string,
    seriesId: string,
    lastReadChapterId: string,
  ) => void,
  unreadChapterCount: number,
};

const SeriesPage = ({
  series,
  chapters,
  collectionSlug,
  lastReadChapterId,
  markAsRead,
  unreadChapterCount,
}: Props) => {
  const firstChapter = chapters[chapters.length - 1];
  const nextChapter =
    unreadChapterCount > 0 && lastReadChapterId
      ? utils.nextChapterToRead(chapters, lastReadChapterId)
      : null;
  const supportsReading = series.supportsReading;
  const hasChapters = chapters.length > 0;

  return (
    <div className="pb-5">
      <ScrollReset />
      <Head>
        <title>{series.title}</title>
      </Head>
      <div className="mw-600 w-100p mh-auto p-relative">
        <header className="p-relative z-3 x xa-center xj-spaceBetween pa-2 mb-3 c-white">
          <Link to="/" className="x hover">
            <Icon name="arrow-left" {...iconProps} />
          </Link>
          <Popover
            content={({ close }) => (
              <div className="pa-2">
                <Popover.Item
                  iconBefore={<Icon name="new-tab" {...iconProps} />}
                  label={`Open on ${series.site.name}`}
                  href={series.url}
                  onClick={close}
                  target="_blank"
                  rel="noreferrer noopener"
                />
                {collectionSlug &&
                  unreadChapterCount > 0 && (
                    <Fragment>
                      <Popover.Divider />
                      <Popover.Item
                        iconBefore={<Icon name="bookmark" {...iconProps} />}
                        label={`Mark ${unreadChapterCount} chapters as read`}
                        onClick={() => {
                          const latestChapter = chapters[0];
                          markAsRead(
                            collectionSlug,
                            series.id,
                            latestChapter.id,
                          );
                          close();
                        }}
                      />
                    </Fragment>
                  )}
              </div>
            )}
            position={Popover.Position.BOTTOM_RIGHT}>
            <Button inline noPadding className="x hover">
              <Icon name="more-vertical" {...iconProps} />
            </Button>
          </Popover>
        </header>
      </div>
      <div className="bgc-black p-absolute l-0 r-0 t-0" css="height: 61px" />
      <div className="mw-600 mh-auto p-relative">
        <header className="x mb-4 pt-3 ph-3">
          <div className="mr-3 w-50p" css="max-width: 140px;">
            <a
              href={series.coverImageUrl}
              target="_blank"
              rel="noreferrer noopener">
              <CoverImage series={series} />
            </a>
          </div>
          <div className="x xd-column">
            <h1 className="fs-20 fs-24-m fw-semibold lh-1d25 mb-1">
              {series.title}
            </h1>
            <a
              href={series.url}
              className="fs-14 c-gray3"
              target="_blank"
              rel="noopener noreferrer">
              {series.site.name}
              <Icon name="new-tab" size={16} iconSize={16} />
            </a>
            {collectionSlug && (
              <div css="margin-top: auto;">
                <FollowButton inline seriesId={series.id} />
              </div>
            )}
          </div>
        </header>
        {hasChapters && (
          <div className="ph-3 mb-4">
            {nextChapter ? (
              <Link to={utils.getReaderUrl(nextChapter.id)}>
                <Button variant="border">Continue Reading</Button>
              </Link>
            ) : (
              <Link to={utils.getReaderUrl(firstChapter.id)}>
                <Button variant="border">Start Reading</Button>
              </Link>
            )}
          </div>
        )}
        <div className="ph-3 mb-4">
          <div className="mb-3">
            <Label>Author</Label>
            <div>{series.author}</div>
          </div>
          <div>
            <Label>Description</Label>
            <div>
              <TextExcerpt trimAfterLength={200}>
                {series.description}
              </TextExcerpt>
            </div>
          </div>
        </div>
        <div>
          {hasChapters ? (
            chapters.map(chapter => (
              <div className="bb-1 bc-gray1 ph-3" key={chapter.id}>
                <ChapterRow
                  chapter={chapter}
                  isLastReadChapter={chapter.id === lastReadChapterId}
                />
              </div>
            ))
          ) : (
            <div className="bgc-gray0 ta-center br-3 ph-4 pv-4">
              {!supportsReading && (
                <Fragment>
                  <Icon name="warning" className="mb-3" />
                  <div className="mb-3 fw-semibold">No chapters</div>
                </Fragment>
              )}
              <p className="c-gray4">
                {supportsReading
                  ? `This series has no chapters available to read.`
                  : `${series.site.name} doesn't support reading on Poketo.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { series: seriesById, chapters: chaptersById } = state;
  const { seriesId } = ownProps;

  const series = seriesById[seriesId];
  const chapters = series.chapters
    ? series.chapters.map(chapterId => chaptersById[chapterId])
    : [];

  const collectionSlug = state.auth.collectionSlug;
  const collection = state.collections[collectionSlug];

  const bookmark = collection ? collection.bookmarks[seriesId] : null;
  const lastReadChapterId = bookmark ? bookmark.lastReadChapterId : null;
  const unreadChapterCount = lastReadChapterId
    ? utils.getUnreadChapters(chapters, lastReadChapterId).length
    : 0;

  return {
    series,
    chapters,
    collectionSlug,
    lastReadChapterId,
    unreadChapterCount,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => {
  return {
    markAsRead: (collectionSlug, seriesId, chapterId) => {
      dispatch(markSeriesAsRead(collectionSlug, seriesId, chapterId));
    },
  };
};

const ConnectedSeriesPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeriesPage);

export default withRouter(
  connect((state, ownProps) => {
    const { series: seriesById } = state;
    const { seriesId } = ownProps.match.params;

    const status = seriesById._status[seriesId];

    if (status === undefined) {
      return { isFetching: true };
    }

    const isFetching = status.fetchStatus === 'fetching';
    const errorCode = status.errorCode || seriesById[seriesId] === undefined;

    return { isFetching, errorCode };
  })(SeriesPageContainer),
);
