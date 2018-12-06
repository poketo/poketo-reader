// @flow

import { Component, type Node } from 'react';
import { connect } from 'react-redux';

import { getEntityShorthand } from '../store/utils';
import { getCollectionSlug } from '../store/reducers/navigation';
import { fetchCollectionIfNeeded } from '../store/reducers/collections';
import type { Dispatch, EntityShorthand, ErrorCode } from '../store/types';
import type { Collection } from '../types';

type Props = {
  collectionSlug: string,
  dispatch: Dispatch,
  entity: EntityShorthand<Collection>,
  children: ({
    collection: Collection | null,
    isFetching: boolean,
    errorCode: ErrorCode | null,
  }) => Node,
};

class FetchCollection extends Component<Props> {
  componentDidMount() {
    const { dispatch, collectionSlug } = this.props;
    dispatch(fetchCollectionIfNeeded(collectionSlug));
  }

  render() {
    const { entity } = this.props;
    const { entity: collection, isFetching, errorCode } = entity;

    return this.props.children({ collection, isFetching, errorCode });
  }
}

function mapStateToProps(state) {
  const slug = getCollectionSlug(state) || '';
  const entity = getEntityShorthand(state.collections, slug);

  return {
    collectionSlug: slug,
    entity,
  };
}

export default connect(mapStateToProps)(FetchCollection);
