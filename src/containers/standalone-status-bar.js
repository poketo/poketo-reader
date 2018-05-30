// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import utils from '../utils';

type Props = { visible: boolean };

class StandaloneStatusBar extends Component<Props> {
  componentDidMount() {
    if (
      utils.isStandalone() &&
      utils.isAppleDevice() &&
      document.documentElement
    ) {
      document.documentElement.classList.add('status-bar-ios-offset-enabled');
    }
  }

  componentWillUnmount() {
    if (document.documentElement) {
      document.documentElement.classList.remove(
        'status-bar-ios-offset-enabled',
      );
    }
  }

  render() {
    return this.props.visible ? (
      <div className="StatusBar p-fixed t-0 l-0 r-0 z-10 bgc-black" />
    ) : null;
  }
}

export default connect(state => {
  const { orientation } = state.device;

  const visible =
    utils.isStandalone() && utils.isAppleDevice() && orientation === 'portrait';

  return { visible };
})(StandaloneStatusBar);
