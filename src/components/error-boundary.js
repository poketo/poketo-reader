import React, { Component } from 'react';
import CodeBlock from './code-block';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
    errorStack: null,
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true, errorStack: info.componentStack });
  }

  render () {
    const { children } = this.props;
    const { hasError, errorStack } = this.state;

    if (hasError) {
      return (
        <div>
          <p>Something went wrong. You can reload the page to go back, or help us by <a href="https://github.com/rosszurowski/poketo-site">reporting this issue</a> with the error below.</p>
          <CodeBlock>{errorStack}</CodeBlock>
        </div>
      )
    }

    return children;
  }
}
