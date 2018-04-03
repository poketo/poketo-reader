// @flow

import React, { Component } from 'react';
import { withRouter, type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import CircleLoader from '../components/loader-circle';
import CodeBlock from '../components/code-block';
import CollectionFeed from '../containers/collection-feed';

import NotFoundView from './not-found-view';

import { fetchCollectionIfNeeded } from '../store/reducers/collections';

import type { Dispatch } from '../store/types';
import type { Chapter, ChapterMetadata, Collection, Series } from '../types';

type Props = {
  dispatch: Dispatch,
  collection: ?Collection,
  collectionsBySlug: { [slug: string]: Collection },
  chaptersById: { [id: string]: Chapter | ChapterMetadata },
  seriesById: { [id: string]: Series },
  match: { params: { collectionSlug: string } },
  history: RouterHistory,
};

class FeedView extends Component<Props> {
  static mapStateToProps = (state, ownProps) => ({
    collectionsBySlug: state.collections,
    collection: state.collections[ownProps.match.params.collectionSlug],
  });

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { collectionSlug } = match.params;

    dispatch(fetchCollectionIfNeeded(collectionSlug));
  }

  render() {
    const { collection, history, collectionsBySlug } = this.props;
    const { isFetching, errorCode } = collectionsBySlug._status;

    if (isFetching) {
      return (
        <div>
          <div className="x xd-column xa-center xj-center p-fixed p-center ta-center">
            <div className="mb-3">
              <CircleLoader />
            </div>
          </div>
        </div>
      );
    }

    if (errorCode === 'NOT_FOUND' || !collection) {
      return <NotFoundView />;
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
