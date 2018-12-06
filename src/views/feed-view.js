// @flow

import React, { Component } from 'react';

import CircleLoader from '../components/loader-circle';
import FetchCollection from '../components/fetch-collection';
import CollectionHeader from '../components/collection-header';
import CollectionErrorMessage from '../components/collection-error';
import CollectionPage from '../components/collection-page';

type Props = {};

export default class FeedView extends Component<Props> {
  render() {
    return (
      <div className="pb-6 h-100p">
        <CollectionHeader />
        <FetchCollection>
          {({ collection, isFetching, errorCode }) =>
            collection ? (
              <CollectionPage collection={collection} />
            ) : isFetching ? (
              <div className="pt-5 x xj-center">
                <CircleLoader />
              </div>
            ) : (
              <div className="pt-4 ph-3 mw-500 mh-auto ta-center">
                <CollectionErrorMessage errorCode={errorCode} />
              </div>
            )
          }
        </FetchCollection>
      </div>
    );
  }
}
