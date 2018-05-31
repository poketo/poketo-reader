// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import utils from '../utils';

type Props = { visible: boolean };

class StandaloneStatusBar extends Component<Props> {
  static offsetClassName = 'status-bar-ios-offset';

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <Fragment>
        <div className="StatusBar p-fixed t-0 l-0 r-0 z-10 bgc-black" />
        <style>{`.${
          StandaloneStatusBar.offsetClassName
        } { padding-top: 20px; }`}</style>
      </Fragment>
    );
  }
}

export default connect(state => {
  const { orientation } = state.device;

  const visible =
    utils.isStandalone() && utils.isAppleDevice() && orientation === 'portrait';

  return { visible };
})(StandaloneStatusBar);
