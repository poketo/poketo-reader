// @flow

import { Component, type Node, type ChildrenArray } from 'react';
import ReactDOM from 'react-dom';

let portalContainer;

type Props = {
  children: Node | ChildrenArray<Node>,
};

export default class Portal extends Component<Props> {
  el: HTMLDivElement;

  constructor() {
    super();

    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.setAttribute('portal-container', '');
      if (document.body) {
        document.body.appendChild(portalContainer);
      }
    }

    this.el = document.createElement('div');
  }

  componentDidMount() {
    portalContainer.appendChild(this.el);
  }

  componentWillUnmount() {
    portalContainer.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
