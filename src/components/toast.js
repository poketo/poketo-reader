// @flow

import React, { PureComponent, type Node } from 'react';
import styled, { keyframes } from 'react-emotion';
import { Transition } from 'react-transition-group';

const toastOpen = keyframes`
  from {
    opacity: 0;
    transform: translateY(-110%);
  }
  to {
    transform: translateY(0);
  }
`;

const toastClose = keyframes`
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
`;

const animationProps = `400ms cubic-bezier(0.175, 0.885, 0.32, 1.175) both`;

const StyledToast = styled.div`
  max-width: 200px;

  &[data-state='entering'],
  &[data-state='entered'] {
    animation: ${toastOpen} ${animationProps};
  }

  &[data-state='exiting'],
  &[data-state='exited'] {
    animation: ${toastClose} ${animationProps};
  }
`;

type Props = {
  children?: Node,
  onRemove: () => void,
  isShown: boolean,
};

type State = {
  isShown: boolean,
};

export default class Toast extends PureComponent<Props, State> {
  static defaultProps = {
    onRemove: () => {},
  };

  state = {
    isShown: true,
  };

  static getDerivedStateFromProps(nextProps: Props, prevProps: Props) {
    if (nextProps.isShown === prevProps.isShown) {
      return null;
    }

    return { isShown: nextProps.isShown };
  }

  render() {
    const { isShown, children } = this.props;

    return (
      <Transition appear unmountOnExit timeout={400} in={isShown}>
        {state => (
          <StyledToast
            data-state={state}
            className="e-2 bgc-white fs-14 br-4 pa-2 ta-center mh-auto">
            {children}
          </StyledToast>
        )}
      </Transition>
    );
  }
}
