// @flow

import React, { Component, type Node } from 'react';
import CodeBlock from './code-block';

type Props = {
  children: Node,
};

type State = {
  hasError: boolean,
  errorStack: ?string,
};

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
    errorStack: null,
  };

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({ hasError: true, errorStack: info.componentStack });
  }

  handleReloadClick = (e: SyntheticMouseEvent<HTMLAnchorElement>) => {
    window.location.reload();
  };

  render() {
    const { children } = this.props;
    const { hasError, errorStack } = this.state;

    if (hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>
            You can{' '}
            <button className="Link" onClick={this.handleReloadClick}>
              reload the page
            </button>, or help us by{' '}
            <a href="https://github.com/rosszurowski/poketo-site/issues/new">
              reporting this issue
            </a>{' '}
            with the error below.
          </p>
          <CodeBlock>{errorStack}</CodeBlock>
        </div>
      );
    }

    return children;
  }
}
