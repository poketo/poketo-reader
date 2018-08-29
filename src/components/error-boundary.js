// @flow

import React, { Component, type Node } from 'react';
import CodeBlock from './code-block';

type Props = {
  children: Node,
};

type State = {
  hasError: boolean,
  errorMessage: ?string,
  errorStack: ?string,
};

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false,
    errorMessage: null,
    errorStack: null,
  };

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({
      hasError: true,
      errorMessage: error.message,
      errorStack: info.componentStack,
    });
    window.Rollbar.error(error);
  }

  handleReloadClick = () => {
    window.location.reload();
  };

  render() {
    const { children } = this.props;
    const { hasError, errorMessage, errorStack } = this.state;

    if (hasError) {
      return (
        <div className="pa-3 pt-4 pt-6-m mw-900 mh-auto">
          <h2>Something went wrong.</h2>
          <p>
            You can{' '}
            <button className="Link" onClick={this.handleReloadClick}>
              reload the page
            </button>
            , or help us by{' '}
            <a href="https://github.com/poketo/site/issues/new">
              reporting this issue
            </a>{' '}
            with the error below.
          </p>
          <CodeBlock>
            {errorMessage}
            {errorStack}
          </CodeBlock>
        </div>
      );
    }

    return children;
  }
}
