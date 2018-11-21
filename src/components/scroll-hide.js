// @flow

import { Component, type Node } from 'react';

type Props = {
  children: ({ isActive: boolean }) => Node,
  threshold: number,
  topThreshold: number,
};

type State = {
  isActive: boolean,
  isTop: boolean,
};

export default class ScrollHide extends Component<Props, State> {
  tickId: ?AnimationFrameID = null;
  scrollY: number;
  lastScrollY: number;

  state = {
    isActive: true,
    isTop: false,
  };

  static defaultProps = {
    threshold: 12,
    topThreshold: 60,
  };

  componentDidMount() {
    this.scrollY = window.scrollY;
    this.lastScrollY = this.scrollY;
    this.tickId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    if (this.tickId) {
      cancelAnimationFrame(this.tickId);
    }
  }

  isThresholdExceeded() {
    return Math.abs(this.scrollY - this.lastScrollY) > this.props.threshold;
  }

  tick = () => {
    this.scrollY = window.scrollY;

    if (this.lastScrollY !== this.scrollY) {
      if (
        this.lastScrollY < this.props.topThreshold ||
        this.lastScrollY > window.scrollY
      ) {
        if (!this.state.isActive) {
          if (this.isThresholdExceeded()) {
            this.setState({ isActive: true });
          }

          if (this.scrollY < this.props.topThreshold) {
            this.setState({ isTop: true });
          }
        }
      } else {
        if (this.state.isActive) {
          if (this.isThresholdExceeded()) {
            this.setState({ isActive: false });
          }
        }
      }

      if (this.scrollY >= this.props.topThreshold && this.state.isTop) {
        this.setState({ isTop: false });
      }

      this.lastScrollY = this.scrollY;
    }

    this.tickId = requestAnimationFrame(this.tick);
  };

  render() {
    const { isActive } = this.state;
    return this.props.children({ isActive });
  }
}
