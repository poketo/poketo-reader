// @flow

import React, { Component, type Node } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  children?: Node,
  onRequestClose?: () => void,
};

export default class Panel extends Component<Props> {
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
        <div className="Panel-background" onClick={this.handleOverlayClick} />
        <div className="Panel-menu">{children}</div>
      </div>,
      root,
    );
  }
}
