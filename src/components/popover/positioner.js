// @flow

import React, { Fragment, PureComponent, type Node } from 'react';
import Transition from 'react-transition-group/Transition';
import Portal from '../portal';
import getPosition from './get-position';
import Position from './position';
import type { RefObject } from './types';

import './positioner.css';

type Props = {
  position: $Keys<typeof Position>,
  isShown: boolean,
  children: any => Node,
  bodyOffset: number,
  targetOffset: number,
  target: ({
    ref: RefObject,
    isShown: boolean,
  }) => Node,
  zIndex: number,
  initialScale: number,
  animationDuration: number,
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
    initialScale: 0.9,
    animationDuration: 300,
    onOpenComplete: () => {},
    onCloseComplete: () => {},
  };

  state = initialState();
  // $FlowFixMe
  targetRef: RefObject = React.createRef();
  // $FlowFixMe
  positionerRef: RefObject = React.createRef();

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
    const {
      zIndex,
      target,
      isShown,
      children,
      initialScale,
      animationDuration,
    } = this.props;

    const { left, top, transformOrigin } = this.state;

    return (
      <Fragment>
        {target({ ref: this.targetRef, isShown })}
        <Portal>
          <Transition
            in={isShown}
            timeout={animationDuration}
            onEnter={this.handleEnter}
            onEntered={this.props.onOpenComplete}
            onExited={this.handleExited}
            unmountOnExit>
            {state =>
              children({
                className: 'Positioner',
                state,
                style: {
                  transitionDuration: `${animationDuration}ms`,
                  transformOrigin,
                  transform: `scale(${initialScale}) translateY(-1px)`,
                  left,
                  top,
                  zIndex,
                },
                ref: this.positionerRef,
              })
            }
          </Transition>
        </Portal>
      </Fragment>
    );
  }
}
