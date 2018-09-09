// @flow

import React, { Component, Fragment } from 'react';
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
      return <CircleLoader />;
    }

    return <ConnectedSeriesPage seriesId={this.props.match.params.seriesId} />;
  }
}

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

const Label = ({ className, ...props }: { className?: string }) => (
  <div className={cx(className, 'fs-14 c-gray3 mb-1')} {...props} />
);

const iconProps = {
  iconSize: 20,
  size: 44,
};

const SeriesPage = ({
  series,
  chapters,
  collectionSlug,
  lastReadChapterId,
  markAsRead,
  unreadChapterCount,
}: Props) => (
  <div className="pb-5">
    <ScrollReset />
    <div className="mw-600 w-100p mh-auto p-relative">
      <header className="x xa-center xj-spaceBetween pv-3 mb-3 c-white p-absolute t-0 w-100p z-3">
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
                        markAsRead(collectionSlug, series.id, latestChapter.id);
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
    <div className="bgc-black w-100p" style={{ height: 140 }} />
    <div className="mw-600 mh-auto p-relative">
      <header className="x xa-end mb-4 ph-3" css="margin-top: -60px;">
        <div className="mr-3 w-50p" css="max-width: 140px;">
          <a
            href={series.coverImageUrl}
            target="_blank"
            rel="noreferrer noopener">
            <CoverImage series={series} />
          </a>
        </div>
        <div>
          <h1 className="fs-24 fs-32-m fw-semibold lh-1d25">{series.title}</h1>
          <a
            href={series.url}
            className="c-gray3"
            target="_blank"
            rel="noopener noreferrer">
            {series.site.name}
            <Icon name="new-tab" size={16} iconSize={16} />
          </a>
        </div>
      </header>
      <div className="ph-3 mb-4">
        {collectionSlug && (
          <div className="mb-4">
            <FollowButton seriesId={series.id} />
          </div>
        )}
        <div className="mb-3">
          <Label>Author</Label>
          <div>{series.author}</div>
        </div>
        <div>
          <Label>Description</Label>
          <div>{series.description}</div>
        </div>
      </div>
      {unreadChapterCount > 0 &&
        lastReadChapterId && (
          <div className="ph-3 mb-4">
            <Link to={utils.getReaderUrl(lastReadChapterId)}>
              <Button>Continue Reading</Button>
            </Link>
          </div>
        )}
      <div>
        {series.supportsReading ? (
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
            <Icon name="warning" className="mb-3" />
            <div className="mb-3 fw-semibold">No chapters</div>
            <p className="c-gray4">
              {series.site.name} doesn't support reading on Poketo.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

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
