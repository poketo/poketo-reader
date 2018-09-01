// @flow

import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router';
import { connect } from 'react-redux';

import Feed from '../components/feed';
import Releases from '../components/collection-releases';
import CollectionHeader from '../components/collection-header';
import Toast from './toast';
import { fetchSeriesForCollection } from '../store/reducers/collections';
import { setDefaultCollection } from '../store/reducers/auth';
import type { Collection } from '../types';
import type { Dispatch } from '../store/types';

type Props = {
  dispatch: Dispatch,
  collection: Collection,
  isFetching: boolean,
};

type State = {
  view: 'releases' | 'library',
};

class CollectionPage extends Component<Props, State> {
  state = {
    view: 'releases',
  };

  componentDidMount() {
    const { dispatch, collection } = this.props;
    dispatch(fetchSeriesForCollection(collection.slug));
    dispatch(setDefaultCollection(collection.slug));
  }

  componentDidUpdate(nextProps: Props) {
    if (nextProps.collection.slug !== this.props.collection.slug) {
      nextProps.dispatch(fetchSeriesForCollection(nextProps.collection.slug));
    }
  }

  render() {
    const { collection, isFetching } = this.props;
    const { bookmarks } = collection;

    return (
      <div className="pt-5 pb-6 h-100p">
        <CollectionHeader collectionSlug={collection.slug} />
        <div className="p-fixed t-0 l-0 r-0 z-9 mt-4 pt-2 ph-3 pe-none">
          <Toast isShown={isFetching}>Syncing...</Toast>
        </div>
        <Route
          exact
          path="/c/:slug/"
          render={() => <Redirect to={`/c/${collection.slug}/releases`} />}
        />
        <Route
          path="/c/:slug/releases"
          render={() => (
            <Releases collectionSlug={collection.slug} bookmarks={bookmarks} />
          )}
        />
        <Route
          path="/c/:slug/library"
          render={() => (
            <Feed collectionSlug={collection.slug} bookmarks={bookmarks} />
          )}
        />
      </div>
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

export default withRouter(connect(mapStateToProps)(CollectionPage));
