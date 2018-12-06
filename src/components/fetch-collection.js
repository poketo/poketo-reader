// @flow

import { Component, type Node } from 'react';
import { connect } from 'react-redux';

import { getCollectionSlug } from '../store/reducers/navigation';
import { fetchCollectionIfNeeded } from '../store/reducers/collections';
import type { Dispatch, EntityStatus, ErrorCode } from '../store/types';
import type { Collection } from '../types';

type Props = {
  collection?: Collection,
  collectionSlug: string,
  dispatch: Dispatch,
  status: EntityStatus,
  children: ({
    isFetching: boolean,
    errorCode: ErrorCode | null,
    collection: Collection | null,
  }) => Node,
};

class FetchCollection extends Component<Props> {
  componentDidMount() {
    const { dispatch, collectionSlug } = this.props;
    dispatch(fetchCollectionIfNeeded(collectionSlug));
  }

  render() {
    const { collection, status } = this.props;
    const { fetchStatus, errorCode } = status;

    return this.props.children({
      collection: fetchStatus === 'fetched' ? collection : null,
      isFetching: fetchStatus === 'fetching' || !fetchStatus,
      errorCode: errorCode || null,
    });
  }
}

function mapStateToProps(state) {
  const slug = getCollectionSlug(state);

  return {
    collection: state.collections[slug],
    collectionSlug: slug,
    status: state.collections._status[slug] || {},
  };
}

export default connect(mapStateToProps)(FetchCollection);
