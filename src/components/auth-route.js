// @flow

import React, { type ComponentType } from 'react';
import { Route, Redirect } from 'react-router-dom';

type Props = {
  component: ComponentType<*>,
};

const auth = {
  isAuthenticated: () => {
    return localStorage.getItem('defaultCollection') !== null;
  },
};

const AuthRoute = ({ component: Component, ...rest }: Props) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default AuthRoute;
