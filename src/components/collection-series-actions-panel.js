// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from '../store/types';
import {
  removeBookmark,
  markSeriesAsRead,
} from '../store/reducers/collections';
import { type Series } from '../types';

import Icon from '../components/icon';
import Panel from '../components/panel';
import utils from '../utils';

type Props = {
  dispatch: Dispatch,
  collectionSlug: string,
  series: Series,
  showMarkAsRead: boolean,
  unreadChapterCount: number,
  onRequestClose: () => void,
};

class SeriesActionsPanel extends Component<Props> {
  handleMarkAsReadClick = () => {
    const { dispatch, collectionSlug, series, onRequestClose } = this.props;

    dispatch(markSeriesAsRead(collectionSlug, series.id, utils.getTimestamp()));
    onRequestClose();
  };

  handleRemoveClick = () => {
    const { dispatch, onRequestClose, collectionSlug, series } = this.props;

    if (window.confirm('Do you want to remove this series?')) {
      dispatch(removeBookmark(collectionSlug, series.id));
      onRequestClose();
    }
  };

  render() {
    const { series, showMarkAsRead, unreadChapterCount } = this.props;

    return (
      <Fragment>
        <Panel.Link
          icon={<Icon name="new-tab" iconSize={20} />}
          label={`Open on ${series.site.name}`}
          onClick={() => this.props.onRequestClose()}
          target="_blank"
          rel="noopener noreferrer"
          href={series.url}
        />
        {showMarkAsRead && (
          <Panel.Button
            icon={<Icon name="book" iconSize={20} />}
            label={
              series.supportsReading === true
                ? `Mark ${unreadChapterCount} chapter${
                    unreadChapterCount === 1 ? '' : 's'
                  } as read`
                : `Mark series as read`
            }
            onClick={this.handleMarkAsReadClick}
          />
        )}
        <Panel.Button
          icon={<Icon name="trash" iconSize={20} className="c-coral" />}
          label="Remove series"
          onClick={this.handleRemoveClick}
        />
      </Fragment>
    );
  }
}

export default connect((state, ownProps) => {
  const { seriesId, bookmark } = ownProps;

  const series = state.series[seriesId];
  const showMarkAsRead = series.updatedAt > bookmark.lastReadAt;
  const unreadChapterCount = showMarkAsRead
    ? utils.getUnreadChapters(
        series.chapters.map(id => state.chapters[id]),
        bookmark.lastReadAt,
      ).length
    : 0;

  return {
    showMarkAsRead,
    series,
    unreadChapterCount,
  };
})(SeriesActionsPanel);
