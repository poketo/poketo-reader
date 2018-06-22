// @flow

import React, { Component } from 'react';
import { Route } from 'react-router-dom';

type Props = {
  location: Location,
};

class Analytics extends Component<Props> {
  componentDidMount() {
    this.send(this.props.location.pathname, this.props.location.search);
  }

  componentDidUpdate(prevProps) {
    const { location: prevLocation } = prevProps;
    const { location } = this.props;

    if (
      location.pathname !== prevLocation.pathname ||
      location.search !== prevLocation.search
    ) {
      this.send(location.pathname, location.search);
    }
  }

  send = (pathname: string, search: string = '') => {
    if (window._gauges && process.env.NODE_ENV === 'production') {
      window._gauges.push(['track']);
    }
  };

  render() {
    return null;
  }
}

export default () => <Route component={Analytics} />;
