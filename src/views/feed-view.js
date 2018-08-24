// @flow

import React, { Component } from 'react';
import { withRouter, type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import config from '../config';
import CircleLoader from '../components/loader-circle';
import CodeBlock from '../components/code-block';
import CollectionPage from '../components/collection-page';
import { fetchCollectionIfNeeded } from '../store/reducers/collections';

import type { Dispatch, EntityStatus } from '../store/types';
import type { Collection } from '../types';

type Props = {
  collection: ?Collection,
  collectionSlug: string,
  dispatch: Dispatch,
  history: RouterHistory,
  match: { params: { collectionSlug: string } },
  status: EntityStatus,
};

class FeedView extends Component<Props> {
  static mapStateToProps = (state, ownProps) => {
    const slug = ownProps.match.params.collectionSlug;

    return {
      collection: state.collections[slug],
      collectionSlug: slug,
      status: state.collections._status[slug] || {},
    };
  };

  componentDidMount() {
    const { dispatch, collectionSlug } = this.props;
    dispatch(fetchCollectionIfNeeded(collectionSlug));
  }

  handleRefreshClick = () => {
    window.location.reload();
  };

  render() {
    const { collection, collectionSlug, history, status } = this.props;
    const { fetchStatus, errorCode } = status;

    if (!collection) {
      if (fetchStatus === 'fetching') {
        return (
          <div>
            <div className="x xd-column xa-center xj-center p-fixed p-center ta-center">
              <CircleLoader />
            </div>
          </div>
        );
      }

      switch (fetchStatus) {
        case 'NOT_FOUND': {
          return (
            <div className="pa-3">
              We couldn't find a collection with the code {collectionSlug}
            </div>
          );
        }
        case 'TIMED_OUT': {
          return (
            <div className="pa-3">
              Loading your collection timed out.{' '}
              <button className="Link" onClick={this.handleRefreshClick}>
                Refresh to try again.
              </button>
            </div>
          );
        }
        default: {
          return (
            <div className="pa-3">
              <p>Something went wrong while loading.</p>
              <CodeBlock>{errorCode}</CodeBlock>
              <p>
                If you have a minute, please{' '}
                <a href={config.githubSiteIssueUrl} className="Link">
                  report this as a bug.
                </a>
              </p>
            </div>
          );
        }
      }
    }

    return <CollectionPage collection={collection} history={history} />;
  }
}

export default withRouter(connect(FeedView.mapStateToProps)(FeedView));
