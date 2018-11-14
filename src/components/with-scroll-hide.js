// @flow

import React, { Component, type ComponentType } from 'react';

type Options = {};

type Props = {};

type State = {
  isActive: boolean,
  isTop: boolean,
};

const defaultOptions = {
  threshold: 12,
  topThreshold: 60,
};

export default (options: Options = {}) => (
  WrappedComponent: ComponentType<any>,
) => {
  const opts = { ...defaultOptions, ...options };

  return class withScrollHide extends Component<Props, State> {
    tickId: ?AnimationFrameID = null;
    scrollY: number;
    lastScrollY: number;

    state = {
      isActive: true,
      isTop: false,
    };

    componentDidMount() {
      this.scrollY = window.scrollY;
      this.lastScrollY = this.scrollY;
      this.tick();
      this.tickId = requestAnimationFrame(this.tick);
    }

    componentWillUnmount() {
      if (this.tickId) {
        cancelAnimationFrame(this.tickId);
      }
    }

    isThresholdExceeded() {
      return Math.abs(this.scrollY - this.lastScrollY) > opts.threshold;
    }

    tick = () => {
      this.scrollY = window.scrollY;

      if (this.lastScrollY !== this.scrollY) {
        if (
          this.lastScrollY < opts.topThreshold ||
          this.lastScrollY > window.scrollY
        ) {
          if (!this.state.isActive) {
            if (this.isThresholdExceeded()) {
              this.setState({ isActive: true });
            }

            if (this.scrollY < opts.topThreshold) {
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

        if (this.scrollY >= opts.topThreshold && this.state.isTop) {
          this.setState({ isTop: false });
        }

        this.lastScrollY = this.scrollY;
      }

      this.tickId = requestAnimationFrame(this.tick);
    };

    render() {
      const { isActive, isTop } = this.state;
      return <WrappedComponent {...this.props} isActive={isActive || isTop} />;
    }
  };
};
