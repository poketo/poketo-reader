// @flow

import React, { Component, Fragment } from 'react';
import Head from 'react-helmet';
import { css, cx } from 'react-emotion/macro';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getEntityShorthand } from '../store/utils';
import { markSeriesAsRead } from '../store/reducers/collections';
import { fetchSeriesIfNeeded } from '../store/reducers/series';
import { getCollectionSlug } from '../store/reducers/navigation';
import BackButtonContainer from '../components/back-button-container';
import Button from '../components/button';
import CoverImage from '../components/series-cover-image';
import CircleLoader from '../components/loader-circle';
import ChapterRow from '../components/chapter-row';
import FollowButton from '../components/follow-button';
import NextChapterRow from '../components/next-chapter-row';
import ScrollReset from '../components/scroll-reset';
import TextExcerpt from '../components/text-excerpt';
import Icon from '../components/icon';
import Popover from '../components/popover';
import utils from '../utils';

import type { Series, ChapterMetadata } from 'poketo';
import type { EntityShorthand, Dispatch } from '../store/types';
import type { Bookmark } from '../../shared/types';

const headerClassName = css`
  height: 61px;
`;

const seriesCoverClassName = css`
  max-width: 140px;
`;

const nextChapterClassName = css`
  background-color: rgba(235, 233, 231, 0.4);
`;

type ContainerProps = {
  dispatch: Dispatch,
  entity: EntityShorthand<Series>,
  match: {
    params: {
      seriesId: string,
    },
  },
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
    const { entity } = this.props;

    if (entity.entity) {
      return <ConnectedSeriesPage seriesId={entity.entity.id} />;
    }

    if (entity.isFetching) {
      return (
        <div className="x xj-center xa-center mh-100vh">
          <CircleLoader />
        </div>
      );
    }

    switch (entity.errorCode) {
      default:
        return (
          <div className="pa-3">
            <strong>An unknown error occurred.</strong>
            <br />
            Try refreshing to page to fix it.
          </div>
        );
    }
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
  bookmark?: Bookmark,
  chapters: ChapterMetadata[],
  collectionSlug: ?string,
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
  bookmark,
  markAsRead,
  unreadChapterCount,
}: Props) => {
  const firstChapter = chapters[chapters.length - 1];
  const mostRecentChapter = chapters[0];

  const nextChapter =
    bookmark && bookmark.lastReadChapterId
      ? utils.nextChapterToRead(chapters, bookmark.lastReadChapterId)
      : firstChapter;

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
          <BackButtonContainer>
            {({ to }) => (
              <Link to={to} className="x hover">
                <Icon name="arrow-left" {...iconProps} />
              </Link>
            )}
          </BackButtonContainer>
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
                <Popover.Item
                  iconBefore={<Icon name="new-tab" {...iconProps} />}
                  label={`Open on /r/manga`}
                  href={utils.getRedditUrl(series.title)}
                  onClick={close}
                  target="_blank"
                  rel="noreferrer noopener"
                />
                {bookmark &&
                  collectionSlug &&
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
      <div
        className={cx('bgc-black p-absolute l-0 r-0 t-0', headerClassName)}
      />
      <div className="mw-600 mh-auto p-relative">
        <header className="mb-4 pt-3 ph-3 ta-center">
          <div className={cx('mb-4 w-50p mh-auto', seriesCoverClassName)}>
            <a
              href={series.coverImageUrl}
              target="_blank"
              rel="noreferrer noopener">
              <CoverImage series={series} />
            </a>
          </div>
          <div>
            <h1 className="fs-24 fw-semibold lh-1d25 mb-1">{series.title}</h1>
            <a
              href={series.url}
              className="fs-14 fs-16-m c-gray3"
              target="_blank"
              rel="noopener noreferrer">
              {series.site.name}
              <Icon name="new-tab" size={16} iconSize={16} />
            </a>
          </div>
        </header>
        {collectionSlug && (
          <div className="ph-3 mb-3">
            <FollowButton seriesId={series.id} />
          </div>
        )}
        {hasChapters &&
          nextChapter && (
            <div className="mb-4 ph-3">
              <div className={cx('pt-3 pb-2 ph-2 br-3', nextChapterClassName)}>
                <Label className="ph-2">
                  {bookmark
                    ? bookmark.lastReadChapterId === mostRecentChapter.id
                      ? 'Newest Chapter'
                      : 'Next Chapter'
                    : 'First Chapter'}
                </Label>
                <NextChapterRow chapter={nextChapter} />
              </div>
            </div>
          )}
        {(series.author || series.description) && (
          <div className="ph-3 mb-4">
            {series.description && (
              <div className="mb-3">
                <Label>Author</Label>
                <div>{series.author}</div>
              </div>
            )}
            {series.description && (
              <div>
                <Label>Description</Label>
                <div>
                  <TextExcerpt trimAfterLength={200}>
                    {series.description}
                  </TextExcerpt>
                </div>
              </div>
            )}
          </div>
        )}
        <div>
          {hasChapters ? (
            chapters.map(chapter => (
              <div className="bb-1 bc-gray1" key={chapter.id}>
                <ChapterRow chapter={chapter} bookmark={bookmark} />
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

  const collectionSlug = getCollectionSlug(state);
  const collection = state.collections[collectionSlug];

  const bookmark = collection ? collection.bookmarks[seriesId] : null;
  const unreadChapterCount = bookmark
    ? bookmark.lastReadChapterId
      ? utils.getUnreadChapters(chapters, bookmark.lastReadChapterId).length
      : 0
    : 0;

  return {
    series,
    chapters,
    collectionSlug,
    bookmark,
    unreadChapterCount,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): Object => {
  return {
    markAsRead: (collectionSlug, seriesId, chapterId) => {
      dispatch(
        markSeriesAsRead(collectionSlug, seriesId, {
          lastReadAt: utils.getTimestamp(),
          lastReadChapterId: chapterId,
        }),
      );
    },
  };
};

const ConnectedSeriesPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeriesPage);

export default connect((state, ownProps) => {
  const { seriesId } = ownProps.match.params;

  const entity = getEntityShorthand(state.series, seriesId);
  const { isFetching, errorCode } = entity;

  return { isFetching, errorCode };
})(SeriesPageContainer);
