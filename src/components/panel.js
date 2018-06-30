// @flow

import React, { Component, type Node } from 'react';
import ScrollLock from 'react-scrolllock';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Portal from './portal';

import './panel.css';

type PanelProps = {
  children?: Node,
  onRequestClose: () => void,
};

type PanelButtonProps = {
  icon: Node,
  label: Node,
  onClick: (e: SyntheticEvent<HTMLButtonElement>) => void,
};

type PanelContentProps = {
  children?: Node,
  title?: string,
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
  static Content: (props: PanelContentProps) => Node;
  static Transition: (props: PanelTransitionProps) => Node;
  static TransitionGroup: (props: {}) => Node;
  static Link: (props: PanelLinkProps) => Node;

  static defaultProps = {
    onRequestClose: () => {},
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
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
    const { children } = this.props;


    return (
      <Portal>
        <div className="Panel">
          <ScrollLock />
          <div className="Panel-background" onClick={this.handleOverlayClick} />
          <div className="Panel-menu">
            {children}
            <button
              className="Panel-cancelButton x w-100p bt-1 bc-gray1 xa-stretch"
              onClick={this.handleOverlayClick}>
              <div className="w-100p pa-3 ta-center o-50p">Cancel</div>
            </button>
          </div>
        </div>
      </Portal>
    );
  }
}

Panel.Content = (props: PanelContentProps) => (
  <div className="pa-3 pa-4-m pb-4">
    {props.title ? (
      <h3 className="fs-18 fw-semibold mb-2">{props.title}</h3>
    ) : null}
    {props.children}
  </div>
);

Panel.Button = (props: PanelButtonProps) => (
  <button className="x w-100p xa-stretch" onClick={props.onClick}>
    <div className="pa-3 x xa-center">{props.icon}</div>
    <div className="pa-3 pl-2 x xa-center">{props.label}</div>
  </button>
);

Panel.Link = ({ icon, label, ...props }: PanelLinkProps) => (
  <a className="x w-100p xa-stretch" {...props}>
    <div className="pa-3 x xa-center">{icon}</div>
    <div className="pa-3 pl-2">{label}</div>
  </a>
);

Panel.Transition = (props: PanelTransitionProps) => (
  <CSSTransition {...props} timeout={400} classNames="panel" />
);

Panel.TransitionGroup = TransitionGroup;

export default Panel;
