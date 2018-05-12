// @flow

import { Component } from 'react';

export default class ScrollReset extends Component<{}> {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}
