// @flow

import React, { PureComponent, type Node } from 'react';
import { Transition } from 'react-transition-group';
import './toast.css';

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

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isShown) {
      this.setState({ isShown: nextProps.isShown });
    }
  }

  render() {
    const { isShown, children } = this.props;
    return (
      <Transition appear unmountOnExit timeout={400} in={isShown}>
        {state => (
          <div
            data-state={state}
            className="Toast e-2 bgc-white fs-14 br-4 pa-2 ta-center mh-auto">
            {children}
          </div>
        )}
      </Transition>
    );
  }
}
