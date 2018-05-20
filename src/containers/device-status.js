// @flow

import { Component } from 'react';
import { connect } from 'react-redux';

import utils from '../utils';
import { setOrientation, setNetworkStatus } from '../store/reducers/device';
import type { Dispatch } from '../store/types';

type Props = {
  dispatch: Dispatch,
};

class DeviceStatus extends Component<Props> {
  componentDidMount() {
    window.addEventListener('orientationchange', this.handleOrientationChange);
    window.addEventListener('online', this.handleNetworkStatusChange);
    window.addEventListener('offline', this.handleNetworkStatusChange);
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.handleOrientationChange);
  }

  handleOrientationChange = () => {
    const orientation = utils.getDeviceOrientation();
    this.props.dispatch(setOrientation(orientation));
  };

  handleNetworkStatusChange = () => {
    this.props.dispatch(setNetworkStatus(navigator.onLine));
  };

  render() {
    return null;
  }
}

export default connect()(DeviceStatus);
