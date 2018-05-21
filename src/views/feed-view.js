// @flow

import React, { Component } from 'react';
import { withRouter, type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import CircleLoader from '../components/loader-circle';
import CodeBlock from '../components/code-block';
import CollectionFeed from '../containers/collection-feed';

import { fetchCollectionIfNeeded } from '../store/reducers/collections';

import type { Dispatch, EntityStatus } from '../store/types';
import type { Collection } from '../types';

type Props = {
  collection: ?Collection,
  dispatch: Dispatch,
  history: RouterHistory,
  match: { params: { collectionSlug: string } },
  status: ?EntityStatus,
};

class FeedView extends Component<Props> {
  static mapStateToProps = (state, ownProps) => {
    const slug = ownProps.match.params.collectionSlug;

    return {
      collection: state.collections[slug],
      status: state.collections._status[slug],
    };
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { collectionSlug } = match.params;

    dispatch(fetchCollectionIfNeeded(collectionSlug));
  }

  render() {
    const { collection, history, status, match } = this.props;
    const { fetchStatus, errorCode } = status || {};
    const { collectionSlug } = match.params;

    if (fetchStatus === 'fetching') {
      return (
        <div>
          <div className="x xd-column xa-center xj-center p-fixed p-center ta-center">
            <CircleLoader />
          </div>
        </div>
      );
    }

    if (errorCode === 'NOT_FOUND' || !collection) {
      return (
        <div className="pa-3">We couldn't find a collection with the code {collectionSlug}</div>
      );
    } else if (errorCode) {
      return (
        <div className="pa-3">
          Something went wrong while loading.
          <CodeBlock>{errorCode}</CodeBlock>
        </div>
      );
    }

    return <CollectionFeed collection={collection} history={history} />;
  }
}

export default withRouter(connect(FeedView.mapStateToProps)(FeedView));
