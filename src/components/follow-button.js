// @flow

import React, { Component, Fragment } from 'react';
import styled, { css } from 'react-emotion/macro';
import { connect } from 'react-redux';
import type { Series } from 'poketo';
import api from '../api';
import { type Dispatch } from '../store/types';
import { getCollectionSlug } from '../store/reducers/navigation';
import { addBookmark } from '../store/reducers/collections';
import Icon from '../components/icon';

const StyledFollowButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  width: 44px;
  height: 44px;

  transition: background-color 200ms ease, color 200ms ease;

  .supports-hover &:hover {
    background: rgba(19, 207, 131, 0.15);
    color: #13cf83;
  }

  > span {
    transition: transform 200ms ease;
  }

  &:active > span {
    transform: scale(0.85);
  }

  ${props =>
    props.isFollowing &&
    css`
      color: #13cf83;
    `};
`;

type Props = {
  collectionSlug: string,
  dispatch: Dispatch,
  isFollowing: boolean,
  series: Series,
};

type State = {
  isFetching: boolean,
};

class FollowButton extends Component<Props, State> {
  state = {
    isFetching: false,
  };

  handleClick = () => {
    const { collectionSlug, dispatch, isFollowing, series } = this.props;
    const { isFetching } = this.state;

    if (isFetching) {
      return;
    }

    const { id: seriesId, url: seriesUrl } = series;

    if (isFollowing) {
      if (
        window.confirm(
          `Do you want to unfollow ${
            series.title
          }? Your reading progress will be lost.`,
        )
      ) {
        this.setState({ isFetching: true });
        api
          .fetchRemoveBookmarkFromCollection(collectionSlug, series.id)
          .then(response => {
            this.setState({ isFetching: false });
            dispatch({
              type: 'REMOVE_BOOKMARK',
              payload: { collectionSlug, seriesId },
            });
          })
          .catch(err => {
            this.setState({ isFetching: false });
            // TODO: Handle errors
          });
      }
      return;
    }

    dispatch(addBookmark(collectionSlug, seriesId, seriesUrl));
  };

  render() {
    const { collectionSlug, isFollowing, ...props } = this.props;
    const { isFetching } = this.state;

    if (!collectionSlug) {
      return null;
    }

    return (
      <StyledFollowButton
        disabled={isFetching}
        loading={isFetching}
        isFollowing={isFollowing}
        onClick={this.handleClick}
        {...props}>
        {isFollowing ? (
          <Fragment>
            <Icon name="bookmark-filled" iconSize={24} size={32} />
            Following
          </Fragment>
        ) : (
          <Fragment>
            <Icon name="bookmark" iconSize={24} size={32} />
            Follow
          </Fragment>
        )}
      </StyledFollowButton>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const collectionSlug = getCollectionSlug(state);
  const collection = state.collections[collectionSlug];

  const isFollowing = Boolean(
    collection.bookmarks && collection.bookmarks[ownProps.seriesId],
  );
  const series = state.series[ownProps.seriesId];

  return { collectionSlug, isFollowing, series };
};

export default connect(mapStateToProps)(FollowButton);
