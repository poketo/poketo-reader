// @flow

import React, { Component, Fragment } from 'react';
import { Link, withRouter, type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import config from '../config';
import CircleLoader from '../components/loader-circle';
import CodeBlock from '../components/code-block';
import CollectionHeader from '../components/collection-header';
import CollectionPage from '../components/collection-page';
import Markdown from '../components/markdown';
import { getCollectionSlug } from '../store/reducers/navigation';
import { fetchCollectionIfNeeded } from '../store/reducers/collections';

import type { Dispatch, EntityStatus } from '../store/types';
import type { Collection } from '../types';

type Props = {
  collection: ?Collection,
  collectionSlug: string,
  dispatch: Dispatch,
  history: RouterHistory,
  status: EntityStatus,
};

class FeedView extends Component<Props> {
  static mapStateToProps = (state, ownProps) => {
    const slug = getCollectionSlug(state);

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

      let children = null;

      switch (errorCode) {
        case 'NOT_FOUND': {
          children = (
            <Fragment>
              <p>
                We couldn't find a collection with the code "{collectionSlug}"
                <br />
                <Link to="/logout">Log out</Link> and try again.
              </p>
            </Fragment>
          );
          break;
        }
        case 'TIMED_OUT': {
          children = (
            <Fragment>
              Loading your collection timed out.{' '}
              <button className="Link" onClick={this.handleRefreshClick}>
                Refresh to try again.
              </button>
            </Fragment>
          );
          break;
        }
        default: {
          children = (
            <Fragment>
              <CodeBlock>{errorCode}</CodeBlock>
              <p>
                If you have a minute, please{' '}
                <a href={config.githubSiteIssueUrl} className="Link">
                  report this as a bug.
                </a>
              </p>
            </Fragment>
          );
        }
      }
      return (
        <div className="pb-6 h-100p">
          <CollectionHeader />

          <div className="pt-4 ph-3 mw-500 mh-auto ta-center">
            <Markdown>
              <h2 className="fw-semibold mb-2">Something went wrong.</h2>
              {children}
            </Markdown>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-6 h-100p">
        <CollectionHeader />
        <CollectionPage collection={collection} history={history} />
      </div>
    );
  }
}

export default withRouter(connect(FeedView.mapStateToProps)(FeedView));
