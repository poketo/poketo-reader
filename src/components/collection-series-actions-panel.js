// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Series } from 'poketo';
import Icon from './icon';
import Panel from './panel';
import api from '../api';
import utils from '../utils';
import { removeBookmark } from '../store/reducers/collections';
import type { Dispatch } from '../store/types';

type Props = {
  dispatch: Dispatch,
  series: Series,
  collectionSlug: string,
  onRequestClose: () => void,
};

class SeriesActionPanel extends Component<Props> {
  handleUnfollowClick = () => {
    const { series, dispatch, collectionSlug, onRequestClose } = this.props;

    if (!window.confirm(utils.getUnfollowMessage(series))) {
      return;
    }

    api
      .fetchRemoveBookmarkFromCollection(collectionSlug, series.id)
      .then(response => {
        dispatch(removeBookmark(collectionSlug, series.id));
        onRequestClose();
      })
      .catch(err => {
        // TODO: Handle errors
      });
  };

  render() {
    const { series } = this.props;

    return (
      <div>
        <div className="ph-3 pt-3 pb-1 mb-2 bb-1 bc-gray1">
          <Panel.Title>{series.title}</Panel.Title>
        </div>
        <Panel.Link
          icon={<Icon name="new-tab" className="c-gray4" />}
          label={`Open on ${series.site.name}`}
          target="_blank"
          rel="noopener noreferrer"
          href={series.url}
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
  const { series: seriesById, navigation } = state;

  return {
    collectionSlug: navigation.collectionSlug,
    series: seriesById[ownProps.seriesId],
  };
};

export default connect(mapStateToProps)(SeriesActionPanel);
