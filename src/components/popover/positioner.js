// @flow

import React, { Fragment, PureComponent, type Node } from 'react';
import { css, keyframes } from 'react-emotion';
import Portal from '../portal';
import getPosition from './get-position';
import Position from './position';

import type { ReactObjRef } from './types';

const appear = keyframes`
  from {
    opacity: 0.0;
    transform: scale(0.9) translateY(-1px);
  }

  to {
    opacity: 1.0;
    transform: scale(1.0) translateY(0);
  }
`;

const className = css`
  position: fixed;
  animation: ${appear} 150ms cubic-bezier(0.175, 0.885, 0.32, 1.175) forwards;
`;

type Props = {
  position: $Keys<typeof Position>,
  isShown: boolean,
  children: Object => Node,
  bodyOffset: number,
  targetOffset: number,
  target: ({
    ref: ReactObjRef<*>,
    isShown: boolean,
  }) => Node,
  zIndex: number,
  onCloseComplete: () => void,
  onOpenComplete: () => void,
};

type State = {
  top: ?number,
  left: ?number,
  transformOrigin: ?string,
};

const initialState = (): State => ({
  top: null,
  left: null,
  transformOrigin: null,
});

export default class Positioner extends PureComponent<Props, State> {
  static defaultProps = {
    position: Position.BOTTOM,
    zIndex: 40,
    bodyOffset: 6,
    targetOffset: 6,
    onOpenComplete: () => {},
    onCloseComplete: () => {},
  };

  state = initialState();
  // $FlowFixMe
  targetRef: RefObject = React.createRef();
  // $FlowFixMe
  positionerRef: RefObject = React.createRef();

  componentDidUpdate(prevProps: Props) {
    if (prevProps.isShown === false && this.props.isShown === true) {
      this.handleEnter();
    } else if (prevProps.isShown === true && this.props.isShown === false) {
      this.handleExited();
    }
  }

  handleEnter = () => {
    this.update();
  };

  getTargetRect = () => {
    if (this.targetRef.current) {
      return this.targetRef.current.getBoundingClientRect();
    }
  };

  update = () => {
    const { positionerRef, targetRef } = this;
    if (
      !this.props.isShown ||
      !targetRef.current ||
      !positionerRef ||
      !positionerRef.current
    ) {
      return;
    }

    const targetRect = this.getTargetRect();
    const documentElement = document.documentElement;

    if (!documentElement) {
      return;
    }

    const viewportHeight = documentElement.clientHeight + window.scrollY;
    const viewportWidth = documentElement.clientWidth + window.scrollX;

    const { rect, transformOrigin } = getPosition({
      position: this.props.position,
      targetRect,
      targetOffset: this.props.targetOffset,
      dimensions: {
        height: positionerRef.current.offsetHeight,
        width: positionerRef.current.offsetWidth,
      },
      viewport: {
        width: viewportWidth,
        height: viewportHeight,
      },
      viewportOffset: this.props.bodyOffset,
    });

    this.setState(
      {
        left: rect.left,
        top: rect.top,
        transformOrigin,
      },
      () => {
        window.requestAnimationFrame(() => {
          this.update();
        });
      },
    );
  };

  handleExited = () => {
    this.setState(
      () => {
        return {
          ...initialState(),
        };
      },
      () => {
        this.props.onCloseComplete();
      },
    );
  };

  render() {
    const { zIndex, target, isShown, children } = this.props;
    const { left, top, transformOrigin } = this.state;

    return (
      <Fragment>
        {target({ ref: this.targetRef, isShown })}
        <Portal>
          {isShown &&
            children({
              className,
              style: {
                transformOrigin,
                left,
                top,
                zIndex,
              },
              ref: this.positionerRef,
            })}
        </Portal>
      </Fragment>
    );
  }
}
