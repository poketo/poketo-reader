// @flow

import React, { Component, Fragment } from 'react';
import styled, { css, cx } from 'react-emotion';
import { connect } from 'react-redux';
import { normalize } from 'normalizr';
import type { Series } from 'poketo';
import api from '../api';
import { type Dispatch } from '../store/types';
import { getCollectionSlug } from '../store/reducers/auth';
import schema from '../store/schema';
import Icon from '../components/icon';
import Button from '../components/button';

const StyledButton = styled(Button)`
  min-width: 140px;
  ${props =>
    props.isFollowing === true && props.loading !== true
      ? css`
          background: #13cf83;
          color: white;

          .supports-hover &:hover,
          &:active {
            background: #ff6f6f;
          }

          .supports-hover &[disabled]:hover,
          &[disabled]:active {
            background: #ff6f6f;
          }
        `
      : css`
          border: 1px #f2f2f2 solid;
          color: #292723;

          .supports-hover &:hover,
          &:active {
            border-color: transparent;
          }
        `};
`;

const followClassName = css`
  .supports-hover ${StyledButton}:hover & {
    display: none;
  }
`;

const unfollowClassName = css`
  display: none;

  .supports-hover ${StyledButton}:hover & {
    display: inline;
  }
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

    if (isFollowing) {
      if (window.confirm(`Do you want to unfollow ${series.title}?`)) {
        this.setState({ isFetching: true });
        api
          .fetchRemoveBookmarkFromCollection(collectionSlug, series.id)
          .then(response => {
            dispatch({
              type: 'REMOVE_BOOKMARK',
              payload: { collectionSlug, seriesId: series.id },
            });
            this.setState({ isFetching: false });
          })
          .catch(err => {
            this.setState({ isFetching: false });
            // TODO: Handle errors
          });
      }
      return;
    }

    this.setState({ isFetching: true });
    api
      .fetchAddBookmarkToCollection(collectionSlug, series.url)
      .then(response => {
        const normalized = normalize(response.data, {
          collection: schema.collection,
          series: schema.series,
        });
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
        this.setState({ isFetching: false });
      })
      .catch(err => {
        // TODO: handle errors
      });
  };

  render() {
    const { collectionSlug, isFollowing, ...props } = this.props;
    const { isFetching } = this.state;

    if (!collectionSlug) {
      return null;
    }

    return (
      <StyledButton
        disabled={isFetching}
        loading={isFetching}
        isFollowing={isFollowing}
        onClick={this.handleClick}
        {...props}>
        {isFollowing ? (
          <Fragment>
            <Icon
              className={followClassName}
              name="bookmark"
              iconSize={18}
              size={32}
            />
            <span className={cx(followClassName, 'pr-2')}>Following</span>
            <span className={unfollowClassName}>Unfollow</span>
          </Fragment>
        ) : (
          <Fragment>
            <Icon name="bookmark" iconSize={18} size={32} />
            Follow
          </Fragment>
        )}
      </StyledButton>
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
