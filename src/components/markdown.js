// @flow

import React from 'react';
import { cx, css } from 'react-emotion';

type Props = {
  className?: string,
};

const markdownClassName = css`
  & h1,
  & h2,
  & h3,
  & h4 {
    font-weight: 500;
    line-height: 1.25;
  }

  & h1,
  & h2 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  & h3 {
    font-size: 1.25rem;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  & h4 {
    font-size: 1rem;
    margin-top: 1rem;
    margin-bottom: 0.25rem;
  }

  & p + p,
  & p + ul,
  & ul + p {
    margin-top: 16px;
  }

  & ul {
    padding-left: 1rem;
  }

  & a {
    color: #ff6f6f;
  }

  & pre {
    background-color: #f2f2f2;
    border-radius: 3px;
    padding: 0.5rem 0.75rem;
    overflow: scroll;
    font-size: 0.75rem;
  }

  & code {
    font-size: 0.75rem;
    background-color: #f2f2f2;
    border-radius: 3px;
    padding: 0.15rem 0.25rem;
  }
`;

const Markdown = ({ className, ...props }: Props) => (
  <div className={cx(className, markdownClassName)} {...props} />
);

export default Markdown;
