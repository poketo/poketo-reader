// @flow

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import Feed from '../components/feed';
import Toast from '../components/toast';
import { fetchSeriesForCollection } from '../store/reducers/collections';
import { setDefaultCollection } from '../store/reducers/navigation';
import type { Collection } from '../types';
import type { Dispatch } from '../store/types';

type Props = {
  loadData: (collectionSlug: string) => void,
  collection: Collection,
  isFetching: boolean,
};

class CollectionPage extends Component<Props> {
  componentDidMount() {
    const { loadData, collection } = this.props;
    loadData(collection.slug);
  }

  componentDidUpdate(prevProps: Props) {
    const { loadData, collection } = this.props;

    if (prevProps.collection.slug !== collection.slug) {
      loadData(collection.slug);
    }
  }

  render() {
    const { collection, isFetching } = this.props;
    const { bookmarks } = collection;

    return (
      <Fragment>
        <div className="p-fixed t-0 l-0 r-0 z-9 mt-4 pt-2 ph-3 pe-none">
          <Toast isShown={isFetching}>Syncing...</Toast>
        </div>
        <Feed bookmarks={bookmarks} />
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { series: seriesById } = state;
  const { bookmarks } = ownProps.collection;

  const seriesIds = Object.keys(bookmarks);
  const statuses = seriesIds.map(id => seriesById._status[id]).filter(Boolean);
  const isFetching = statuses.some(status => status.fetchStatus === 'fetching');

  return { isFetching };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loadData(collectionSlug) {
      dispatch(setDefaultCollection(collectionSlug));
      dispatch(fetchSeriesForCollection(collectionSlug));
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CollectionPage),
);
