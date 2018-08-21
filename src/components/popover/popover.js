// @flow

import React, { Component, type Node, type Element } from 'react';
import Positioner from './positioner';
import PopoverStateless from './popover-stateless';
import PopoverItem from './popover-item';
import PopoverDivider from './popover-divider';
import Position from './position';
import type { ReactObjRef } from './types';

type Props = {
  position: $Keys<typeof Position>,
  isShown: boolean,
  content: Element<*> | (({ close: Function }) => Node),
  children:
    | Element<*>
    | (({ toggle: Function, ref: ReactObjRef<*>, isShown: boolean }) => Node),
  onOpen: () => void,
  onOpenComplete: () => void,
  onClose: () => void,
  onCloseComplete: () => void,
  bringFocusInside: boolean,
};

type State = {
  isShown: boolean,
};

const isOrContains = (el: any, target: any): boolean =>
  el === target || el.contains(target);

export default class Popover extends Component<Props, State> {
  static defaultProps = {
    position: Position.BOTTOM,
    isShown: false,
    onOpen: () => {},
    onOpenComplete: () => {},
    onClose: () => {},
    onCloseComplete: () => {},
    bringFocusInside: true,
  };

  static Position = Position;
  static Item = PopoverItem;
  static Divider = PopoverDivider;

  popoverRef: ReactObjRef<*>;
  targetRef: ReactObjRef<*>;

  constructor(props: Props) {
    super(props);
    this.state = {
      isShown: props.isShown,
    };
  }

  componentWillUnmount() {
    const body = document.body;

    if (body) {
      body.removeEventListener('click', this.handleBodyClick, false);
      body.removeEventListener('keydown', this.handleEscKey, false);
    }
  }

  bringFocusInside = () => {
    if (!this.props.bringFocusInside) return;

    return requestAnimationFrame(() => {
      const { popoverRef } = this;

      if (
        !this.props.isShown ||
        !popoverRef ||
        !popoverRef.current ||
        document.activeElement == null
      ) {
        return;
      }

      const popoverEl = popoverRef.current;

      // $FlowFixMe: React 16.3 ref issue
      const isFocusOutsideModal = !popoverEl.contains(document.activeElement);
      if (isFocusOutsideModal && popoverEl) {
        // Element marked autofocus has higher priority than the other clowns
        // $FlowFixMe: React 16.3 ref issue
        const autofocusElement = popoverEl.querySelector('[autofocus]');
        // $FlowFixMe: React 16.3 ref issue
        const wrapperElement = popoverEl.querySelector('[tabindex]');
        // $FlowFixMe: React 16.3 ref issue
        const buttonElement = popoverEl.querySelector('button');

        if (autofocusElement) {
          autofocusElement.focus();
        } else if (wrapperElement) {
          wrapperElement.focus();
        } else if (buttonElement) {
          buttonElement.focus();
        }
      }
    });
  };

  bringFocusBackToTarget = () => {
    return requestAnimationFrame(() => {
      const { popoverRef, targetRef } = this;

      if (
        !popoverRef ||
        !popoverRef.current ||
        document.activeElement == null
      ) {
        return;
      }

      // $FlowFixMe: React 16.3 ref issue
      const isFocusInsideModal = popoverRef.current.contains(
        document.activeElement,
      );

      // Bring back focus on the target.
      if (
        targetRef &&
        targetRef.current &&
        (document.activeElement === document.body || isFocusInsideModal)
      ) {
        // $FlowFixMe: React 16.3 ref issue
        targetRef.current.focus();
      }
    });
  };

  handleBodyClick = (e: MouseEvent) => {
    const { targetRef, popoverRef } = this;

    if (
      !targetRef ||
      !targetRef.current ||
      !popoverRef ||
      !popoverRef.current
    ) {
      return;
    }

    // Ignore clicks from the popover trigger
    if (targetRef.current === e.target) {
      return;
    }

    // Ignore clicks from the popover itself
    if (isOrContains(popoverRef.current, e.target)) {
      return;
    }

    this.close();
  };

  handleEscKey = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.close();
    }
  };

  toggle = () => {
    if (this.state.isShown) {
      this.close();
    } else {
      this.open();
    }
  };

  open = () => {
    if (this.state.isShown) {
      return;
    }

    this.setState({ isShown: true });

    const body = document.body;
    if (body) {
      body.addEventListener('click', this.handleBodyClick, false);
      body.addEventListener('keydown', this.handleEscKey, false);
    }

    this.props.onOpen();
  };

  close = () => {
    if (!this.state.isShown) {
      return;
    }

    this.setState({ isShown: false });

    const body = document.body;
    if (body) {
      body.removeEventListener('click', this.handleBodyClick, false);
      body.removeEventListener('keydown', this.handleEscKey, false);
    }

    this.bringFocusBackToTarget();
    this.props.onClose();
  };

  handleOpenComplete = () => {
    this.bringFocusInside();
    this.props.onOpenComplete();
  };

  handleCloseComplete = () => {
    this.props.onCloseComplete();
  };

  renderTarget = ({ ref, isShown }: { ref: ReactObjRef<*>, isShown: boolean }) => {
    this.targetRef = ref;

    if (typeof this.props.children === 'function') {
      return this.props.children({
        toggle: this.toggle,
        ref,
        isShown,
      });
    }

    return React.cloneElement(this.props.children, {
      onClick: this.toggle,
      ref,
    });
  };

  render() {
    const { content, position, isShown, onCloseComplete } = this.props;
    const { isShown: stateIsShown } = this.state;

    const shown = isShown || stateIsShown;

    return (
      <Positioner
        target={this.renderTarget}
        position={position}
        isShown={shown}
        onOpenComplete={this.handleOpenComplete}
        onCloseComplete={onCloseComplete}>
        {({ className, style, state, ref }) => {
          this.popoverRef = ref;

          return (
            <PopoverStateless
              ref={ref}
              data-state={state}
              className={className}
              style={style}>
              {typeof content === 'function'
                ? content({ close: this.close })
                : content}
            </PopoverStateless>
          );
        }}
      </Positioner>
    );
  }
}
