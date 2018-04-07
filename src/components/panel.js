// @flow

import React, { Component, type Node } from 'react';
import ReactDOM from 'react-dom';
import ScrollLock from 'react-scrolllock';
import { CSSTransition } from 'react-transition-group';

type PanelProps = {
  children?: Node,
  onRequestClose?: () => void,
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

type PanelTransitionProps = {
  children: Node,
};

class Panel extends Component<PanelProps> {
  static Button: (props: PanelButtonProps) => Node;
  static Transition: (props: PanelTransitionProps) => Node;
  static Link: (props: PanelLinkProps) => Node;

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e: KeyboardEvent) => {
    const { onRequestClose } = this.props;

    if (!onRequestClose) {
      return;
    }

    if (e.keyCode === 27) {
      onRequestClose();
    }
  };

  handleOverlayClick = (e: MouseEvent) => {
    const { onRequestClose } = this.props;

    if (onRequestClose) {
      onRequestClose();
    }
  };

  render() {
    const { children } = this.props;
    const root = document.getElementById('root');

    if (!root) {
      return null;
    }

    return ReactDOM.createPortal(
      <div className="Panel">
        <ScrollLock />
        <div className="Panel-background" onClick={this.handleOverlayClick} />
        <div className="Panel-menu">{children}</div>
      </div>,
      root,
    );
  }
}

Panel.Button = (props: PanelButtonProps) => (
  <button className="x w-100p xa-stretch" onClick={props.onClick}>
    <div className="pa-3 x xa-center">{props.icon}</div>
    <div className="pa-3">{props.label}</div>
  </button>
);

Panel.Link = ({ icon, label, ...props }: PanelLinkProps) => (
  <a className="x w-100p xa-stretch" {...props}>
    <div className="pa-3 x xa-center">{icon}</div>
    <div className="pa-3">{label}</div>
  </a>
);

Panel.Transition = (props: PanelTransitionProps) => (
  <CSSTransition {...props} timeout={400} classNames="panel" />
);

export default Panel;
