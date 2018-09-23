// @flow

import React, { Component, Fragment } from 'react';

type Props = {
  trimAfterLength: number,
  trimTolerance?: number,
  children: string,
};

type State = {
  isExpanded: boolean,
};

export default class TextExcerpt extends Component<Props, State> {
  static defaultProps = {
    trimTolerance: 100,
  };

  state = {
    isExpanded: false,
  };

  handleMoreClick = (e: SyntheticMouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.setState({ isExpanded: true });
  };

  render() {
    const { children, trimAfterLength, trimTolerance } = this.props;
    const { isExpanded } = this.state;

    const shouldTrim = children.length > trimAfterLength + trimTolerance;

    if (isExpanded || !shouldTrim) {
      return children;
    }

    const trimmedChildren = children.substring(0, trimAfterLength).trim();

    return (
      <Fragment>
        {trimmedChildren}
        &hellip;{' '}
        <button className="ml-2 fs-14 Link" onClick={this.handleMoreClick}>
          Read More
        </button>
      </Fragment>
    );
  }
}
