// @flow

import React, { Component, Fragment } from 'react';
import utils from '../utils';

type Props = {};
type State = { visible: boolean, orientation: 'portrait' | 'landscape' };

export default class StandaloneStatusBar extends Component<Props, State> {
  static offsetClassName = 'status-bar-ios-offset';

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: utils.isStandalone() && utils.isAppleDevice(),
      orientation: 'landscape',
    };
  }

  componentDidMount() {
    window.addEventListener('orientationchange', this.handleOrientationChange);
  }

  componentWillUnmount() {
    window.removeEventListener(
      'orientationchange',
      this.handleOrientationChange,
    );
  }

  handleOrientationChange = () => {
    this.setState({ orientation: utils.getDeviceOrientation() });
  };

  render() {
    if (!this.state.visible) {
      return null;
    }

    if (this.state.orientation !== 'portrait') {
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
