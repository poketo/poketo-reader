// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from './icon';
import Panel from './panel';
import api from '../api';
import utils from '../utils';
import { removeBookmark } from '../store/reducers/collections';
import type { Dispatch } from '../store/types';
import type { Bookmark } from '../../shared/types';

type Props = {
  dispatch: Dispatch,
  bookmark: Bookmark,
  collectionSlug: string,
  onRequestClose: () => void,
};

class BookmarkActionPanel extends Component<Props> {
  handleUnfollowClick = () => {
    const { bookmark, dispatch, collectionSlug, onRequestClose } = this.props;

    if (!window.confirm(utils.getUnfollowMessage(bookmark.title))) {
      return;
    }

    api
      .fetchRemoveBookmarkFromCollection(collectionSlug, bookmark.id)
      .then(response => {
        onRequestClose();
        dispatch(removeBookmark(collectionSlug, bookmark.id));
      })
      .catch(err => {
        // TODO: Handle errors
      });
  };

  render() {
    const { bookmark } = this.props;

    return (
      <div>
        <div className="ph-3 pt-3 pb-1 mb-2 bb-1 bc-gray1">
          <Panel.Title>{bookmark.title}</Panel.Title>
        </div>
        <Panel.Link
          icon={<Icon name="new-tab" className="c-gray4" />}
          label={`Open on ${utils.getSiteNameFromId(bookmark.id)}`}
          target="_blank"
          rel="noopener noreferrer"
          href={bookmark.url}
        />
        <Panel.Button
          icon={<Icon name="bookmark" className="c-coral" />}
          label="Unfollow series"
          onClick={this.handleUnfollowClick}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { navigation } = state;

  const slug = navigation.collectionSlug;

  return {
    collectionSlug: slug,
  };
};

export default connect(mapStateToProps)(BookmarkActionPanel);
