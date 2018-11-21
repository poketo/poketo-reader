// @flow

import React, { type ComponentType } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCollectionSlug } from '../store/reducers/navigation';

type Props = {
  component: ComponentType<*>,
  isAuthenticated: boolean,
};

const AuthRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}: Props) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

function mapStateToProps(state) {
  const collectionSlug = getCollectionSlug(state);
  const isAuthenticated =
    collectionSlug !== null && collectionSlug !== undefined;

  return { isAuthenticated };
}

export default connect(mapStateToProps)(AuthRoute);
