// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { normalize } from 'normalizr';
import api from '../api';
import { type Series } from '../types';
import schema from '../store/schema';
import { type Dispatch } from '../store/types';
import { getCollectionSlug } from '../store/reducers/auth';
import { removeBookmark } from '../store/reducers/collections';
import Icon from '../components/icon';
import Button from '../components/button';

type Props = {
  collectionSlug: string,
  dispatch: Dispatch,
  isFollowing: boolean,
  series: Series,
};

type State = {
  isAdding: boolean,
};

class FollowButton extends Component<Props, State> {
  state = {
    isAdding: false,
  };

  handleClick = () => {
    const { collectionSlug, dispatch, isFollowing, series } = this.props;
    const { isAdding } = this.state;

    if (isFollowing) {
      if (window.confirm(`Do you want to unfollow ${series.title}?`)) {
        dispatch(removeBookmark(collectionSlug, series.id));
      }
      return;
    }

    if (isAdding) {
      return;
    }

    this.setState({ isAdding: true });
    api
      .fetchAddBookmarkToCollection(collectionSlug, series.url)
      .then(response => {
        const normalized = normalize(response.data, {
          collection: schema.collection,
          series: schema.series,
        });
        dispatch({ type: 'ADD_ENTITIES', payload: normalized.entities });
        this.setState({ isAdding: false });
      })
      .catch(err => {
        // TODO: handle errors
      });
  };

  render() {
    const { isFollowing } = this.props;
    const { isAdding } = this.state;

    return (
      <Button disabled={isAdding} loading={isAdding} onClick={this.handleClick}>
        {isFollowing ? (
          <Fragment>
            <Icon name="check" iconSize={16} size={32} />
            Following
          </Fragment>
        ) : (
          <Fragment>
            <Icon name="bookmark" iconSize={16} size={32} />
            Follow
          </Fragment>
        )}
      </Button>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const collectionSlug = getCollectionSlug(state);
  const collection = state.collections[collectionSlug];

  const isFollowing = Boolean(collection.bookmarks[ownProps.seriesId]);
  const series = state.series[ownProps.seriesId];

  return { collectionSlug, isFollowing, series };
};

export default connect(mapStateToProps)(FollowButton);
