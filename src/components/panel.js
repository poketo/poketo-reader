// @flow

import React, { Component, type Node, type ElementRef } from 'react';
import { css, cx } from 'react-emotion/macro';
import ScrollLock from 'react-scrolllock';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Portal from './portal';

type PanelTitleProps = {
  className?: string,
  children?: Node,
};

type PanelContentProps = {
  children?: Node,
  title?: string,
};

type PanelButtonProps = {
  icon: Node,
  label: Node,
  onClick: (e: SyntheticEvent<HTMLButtonElement>) => void,
};

type PanelLinkProps = {
  href: string,
  icon: Node,
  label: Node,
};

type PanelChildrenProps = {
  isShown: boolean,
  scrollRef?: ElementRef<*>,
  onRequestClose: () => void,
};

type PanelProps = {
  ...$Exact<PanelChildrenProps>,
  children: PanelChildrenProps => Node,
};

type PanelState = {
  isMounted: boolean,
};

const styles = {
  container: css`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
  `,
  background: css`
    position: absolute;
    top: -90px; /* NOTE: -90px to cover space under the Android Chrome header, which tucks away even with a scroll lock. */
    bottom: 0;
    left: 0;
    right: 0;
    will-change: opacity;
    background-color: rgba(0, 0, 0, 0.9);

    .panel-enter > & {
      opacity: 0.01;
    }

    .panel-enter.panel-enter-active > & {
      opacity: 1;
      transition: opacity 150ms ease;
    }

    .panel-exit > & {
      opacity: 1;
    }

    .panel-exit.panel-exit-active > & {
      opacity: 0.01;
      transition: opacity 400ms ease;
    }
  `,
  menu: css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    overflow: hidden;
    background-color: #fff;
    will-change: transform;
    transition: transform 400ms cubic-bezier(0.19, 1, 0.22, 1),
      opacity 200ms ease;
    z-index: 200;

    @media only screen and (min-width: 768px) {
      position: fixed;
      width: 90%;
      max-width: 500px;
      top: 50%;
      left: 50%;
      border-radius: 4px;
      bottom: auto;
      right: auto;
      transform: translate(-50%, -50%);

      .panel-enter > & {
        opacity: 0.01;
        transform: translate(-50%, -40%);
      }

      .panel-enter.panel-enter-active > & {
        opacity: 1;
        transform: translate(-50%, -50%);
      }

      .panel-exit > & {
        opacity: 1;
        transform: translate(-50%, -50%);
      }

      .panel-exit.panel-exit-active > & {
        opacity: 0.01;
        transform: translate(-50%, -40%);
      }
    }

    @media only screen and (max-width: 768px) {
      .panel-enter > & {
        transform: translateY(100%);
      }

      .panel-enter.panel-enter-active > & {
        transform: translateY(0%);
      }

      .panel-exit > & {
        transform: translateY(0%);
      }

      .panel-exit.panel-exit-active > & {
        transform: translateY(100%);
      }
    }
  `,
};

class Panel extends Component<PanelProps, PanelState> {
  static Button: (props: PanelButtonProps) => Node;
  static Content: (props: PanelContentProps) => Node;
  static Title: (props: PanelTitleProps) => Node;
  static Link: (props: PanelLinkProps) => Node;

  static defaultProps = {
    children: () => null,
    onRequestClose: () => {},
  };

  state = {
    isMounted: false,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    requestAnimationFrame(() => {
      this.setState({ isMounted: true });
    });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.props.onRequestClose();
    }
  };

  handleOverlayClick = (e: MouseEvent) => {
    this.props.onRequestClose();
  };

  render() {
    const { children, scrollRef, isShown, onRequestClose } = this.props;

    const scrollEl = scrollRef && scrollRef.current;
    const shouldLockScroll = this.state.isMounted && scrollEl;

    return (
      <Portal>
        <TransitionGroup>
          {isShown && (
            <CSSTransition unmountOnExit timeout={400} classNames="panel">
              <div className={styles.container}>
                {shouldLockScroll && (
                  <ScrollLock touchScrollTarget={scrollEl} />
                )}
                <div
                  className={styles.background}
                  onClick={this.handleOverlayClick}
                />
                <div className={styles.menu}>
                  {children({ isShown, scrollRef, onRequestClose })}
                  <button
                    className="d-none x-m w-100p bt-1 bc-gray1 xa-stretch"
                    onClick={this.handleOverlayClick}>
                    <div className="w-100p pa-3 ta-center">Cancel</div>
                  </button>
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </Portal>
    );
  }
}

Panel.Title = ({ className, children, ...props }: PanelTitleProps) => (
  <h3 className={cx(className, 'fs-18 fw-semibold mb-2')} {...props}>
    {children}
  </h3>
);

Panel.Content = ({ title, children }: PanelContentProps) => (
  <div className="pa-3 pa-4-m pb-4">
    {title ? <Panel.Title>{title}</Panel.Title> : null}
    {children}
  </div>
);

Panel.Button = ({ icon, label, ...props }: PanelButtonProps) => (
  <button className="x w-100p xa-stretch" {...props}>
    <div className="pa-3 x xa-center">{icon}</div>
    <div className="pa-3 pl-2 x xa-center">{label}</div>
  </button>
);

Panel.Link = ({ icon, label, ...props }: PanelLinkProps) => (
  <a className="x w-100p xa-stretch" {...props}>
    <div className="pa-3 x xa-center">{icon}</div>
    <div className="pa-3 pl-2">{label}</div>
  </a>
);

export default Panel;
