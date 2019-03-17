// @flow

import React, { Component } from 'react';
import { cx, css } from 'react-emotion/macro';
import { connect } from 'react-redux';
import { Route, NavLink, withRouter } from 'react-router-dom';
import FeedItemRow from './feed-item-row';
import Panel from './panel';
import SeriesRow from './series-row';
import BookmarkActionsPanel from './collection-bookmark-actions-panel';
import Icon from './icon';
import utils from '../utils';
import { setLastSeenTab } from '../store/reducers/navigation';
import type { Dispatch } from '../store/types';
import type { Bookmark } from '../../shared/types';
import type { FeedItem } from '../types';

const fullWidthClassName = css`
  flex-basis: 100%;
`;
const nextChapterDivider = css`
  & + & {
    border-top: 1px #f2f2f2 solid;
  }
`;

const CollectionMessage = ({ title, body }) => (
  <div className="ta-center pt-4">
    <h3 className="fs-18 fw-semibold">{title}</h3>
    <p>{body}</p>
  </div>
);

const EmptyMessage = () => (
  <CollectionMessage title="Welcome!" body="Follow a series to get started." />
);

const CollectionNavigation = () => (
  <header className="x ph-2 mb-4 fw-semibold ta-center ta-left-m">
    <NavLink
      to="/feed"
      exact
      className={cx(
        'x xd-row-m  br-4 pv-2 ph-1 xa-center xj-center',
        fullWidthClassName,
      )}
      activeClassName="bgc-extraFadedLightCoral c-coral">
      <Icon name="bookmark" className="mr-1 mr-2-m" />
      Now Reading
    </NavLink>
    <NavLink
      to="/library"
      exact
      className={cx(
        'x br-4 xd-row-m pv-2 ph-1 xa-center xj-center',
        fullWidthClassName,
      )}
      activeClassName="bgc-extraFadedLightCoral c-coral">
      <Icon name="book" className="mr-1 mr-2-m" />
      Library
    </NavLink>
  </header>
);

type NowReadingProps = {
  dispatch: Dispatch,
  hasSeries: boolean,
  feedItems: FeedItem[],
};

class NowReadingFeed extends Component<NowReadingProps> {
  componentDidMount() {
    this.props.dispatch(setLastSeenTab('now-reading'));
  }

  render() {
    if (this.props.hasSeries === false) {
      return <EmptyMessage />;
    }

    if (this.props.feedItems.length < 1) {
      return (
        <CollectionMessage
          title="You're all caught up!"
          body="Check back later for more updates."
        />
      );
    }

    return this.props.feedItems.map(item => (
      <div key={item.series.id} className={cx('pt-2 mt-2', nextChapterDivider)}>
        <FeedItemRow feedItem={item} />
      </div>
    ));
  }
}

type LibraryProps = {
  dispatch: Dispatch,
  feedItems: FeedItem[],
  onMoreClick: (seriesId: string) => void,
};

class LibraryFeed extends Component<LibraryProps> {
  componentDidMount() {
    this.props.dispatch(setLastSeenTab('library'));
  }

  render() {
    if (this.props.feedItems.length < 1) {
      return <EmptyMessage />;
    }

    return this.props.feedItems.map(item => (
      <SeriesRow
        key={item.id}
        feedItem={item}
        onMoreClick={this.props.onMoreClick}
      />
    ));
  }
}

type Props = {
  dispatch: Dispatch,
  bookmarks: { [id: string]: Bookmark },
  feedItems: FeedItem[],
};

type State = {
  activeBookmarkId: string | null,
};

class Feed extends Component<Props, State> {
  state = {
    activeBookmarkId: null,
  };

  handleMoreClick = seriesId => {
    this.setState({ activeBookmarkId: seriesId });
  };

  closePanel = () => {
    this.setState({ activeBookmarkId: null });
  };

  render() {
    const { feedItems, dispatch } = this.props;

    const unreadFeedItems = feedItems
      .filter(item => item.isCaughtUp === false)
      .sort((a, b) => {
        if (a.isCaughtUp !== b.isCaughtUp) {
          return Number(a.isCaughtUp) - Number(b.isCaughtUp);
        }
        if (a.isNewRelease !== b.isNewRelease) {
          return Number(b.isNewRelease) - Number(a.isNewRelease);
        }

        return 0;
      });

    const activeFeedItem = this.state.activeBookmarkId
      ? feedItems.find(item => item.id === this.state.activeBookmarkId)
      : null;

    return (
      <div className="pt-4 ph-2 pb-6 mw-600 mh-auto">
        <CollectionNavigation />
        <Panel
          isShown={Boolean(activeFeedItem)}
          onRequestClose={this.closePanel}>
          {() => (
            <BookmarkActionsPanel
              // $FlowFixMe: The `isShown` conditional ensures this is always true.
              bookmark={activeFeedItem}
              onRequestClose={this.closePanel}
            />
          )}
        </Panel>
        <div className="mb-4">
          <Route
            path="/feed"
            exact
            render={() => (
              <NowReadingFeed
                dispatch={dispatch}
                hasSeries={feedItems.length > 0}
                feedItems={unreadFeedItems}
              />
            )}
          />
          <Route
            path="/library"
            exact
            render={() => (
              <LibraryFeed
                dispatch={dispatch}
                feedItems={feedItems}
                onMoreClick={this.handleMoreClick}
              />
            )}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { series: seriesById, chapters: chaptersById } = state;
  const { bookmarks } = ownProps;

  const seriesIds = Object.keys(bookmarks);
  const feedItems: FeedItem[] = seriesIds
    .map(seriesId => {
      const bookmark = bookmarks[seriesId];

      const series = seriesById[seriesId];
      const chapterIds = (series ? series.chapters : null) || [];
      const chapters = chapterIds.map(id => chaptersById[id]).filter(Boolean);

      const isCaughtUp =
        chapters.length > 0
          ? chapters[0].id === bookmark.lastReadChapterId
          : true;

      const nextChapter =
        isCaughtUp === false
          ? utils.nextChapterToRead(chapters, bookmark.lastReadChapterId)
          : null;

      const hasNewRelease = nextChapter
        ? nextChapter.createdAt > bookmark.lastReadAt
        : false;

      return {
        series,
        chapters,
        isCaughtUp,
        isNewRelease: hasNewRelease,
        id: bookmark.id,
        title: bookmark ? bookmark.title || series.title : series.title,
        lastReadChapterId: bookmark.lastReadChapterId,
        linkTo: bookmark.linkTo,
      };
    })
    // Ignore bookmarks where the series hasn't loaded
    // .filter(item => item)
    .sort((a, b) => {
      return a.title.localeCompare(b.title);
    });

  return { feedItems };
}

export default withRouter(connect(mapStateToProps)(Feed));
