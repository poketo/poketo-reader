// @flow

import React, { Component, type Node, type Element } from 'react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
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

const hasRef = (ref: ReactObjRef<*>) => Boolean(ref && ref.current);
const isOrContains = (el: any, target: any): boolean =>
  el === target || el.contains(target);

const getIsShown = (props: Props, state: State) =>
  props.isShown || state.isShown;

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

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.isShown !== this.props.isShown ||
      prevState.isShown !== this.state.isShown
    ) {
      const isShown = getIsShown(this.props, this.state);

      if (isShown === false) {
        clearAllBodyScrollLocks();
      } else {
        disableBodyScroll();
      }
    }
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
        !hasRef(popoverRef) ||
        document.activeElement == null
      ) {
        return;
      }

      const popoverEl = popoverRef.current;

      const isFocusOutsideModal = !popoverEl.contains(document.activeElement);
      if (isFocusOutsideModal && popoverEl) {
        // Element marked autofocus has higher priority than the other clowns
        const autofocusElement = popoverEl.querySelector('[autofocus]');
        const wrapperElement = popoverEl.querySelector('[tabindex]');
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

      if (!hasRef(popoverRef) || document.activeElement == null) {
        return;
      }

      const isFocusInsideModal = popoverRef.current.contains(
        document.activeElement,
      );

      // Bring back focus on the target.
      if (
        hasRef(targetRef) &&
        (document.activeElement === document.body || isFocusInsideModal)
      ) {
        targetRef.current.focus();
      }
    });
  };

  handleBodyClick = (e: MouseEvent | TouchEvent) => {
    const { targetRef, popoverRef } = this;

    if (!hasRef(targetRef) || !hasRef(popoverRef)) {
      return;
    }

    // Ignore clicks from the popover trigger
    if (isOrContains(targetRef.current, e.target)) {
      return;
    }

    // Ignore clicks from the popover itself
    if (isOrContains(popoverRef.current, e.target)) {
      return;
    }

    e.preventDefault();
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
      body.addEventListener('touchend', this.handleBodyClick, false);
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
      body.removeEventListener('touchend', this.handleBodyClick, false);
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

  renderTarget = ({
    ref,
    isShown,
  }: {
    ref: ReactObjRef<*>,
    isShown: boolean,
  }) => {
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
    const { content, position, onCloseComplete } = this.props;
    const isShown = getIsShown(this.props, this.state);

    return (
      <Positioner
        target={this.renderTarget}
        position={position}
        isShown={isShown}
        onOpenComplete={this.handleOpenComplete}
        onCloseComplete={onCloseComplete}>
        {({ className, style, ref }) => {
          this.popoverRef = ref;

          return (
            <PopoverStateless ref={ref} className={className} style={style}>
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
