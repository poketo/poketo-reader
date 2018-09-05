// @flow

import React, { type Node } from 'react';
import styled, { css } from 'react-emotion';
import CircleLoader from './loader-circle';

type Props = {
  children?: Node,
  className?: string,
  primary?: boolean,
  inline?: boolean,
  iconBefore?: Node,
  loading?: boolean,
  noPadding?: boolean,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  background-color: transparent;
  border-radius: 3px;
  color: currentColor;
  font-weight: normal;
  font-family: Proxima Soft, -apple-system, BlinkMacSystemFont, helvetica neue,
    helvetica, roboto, segoe ui, arial, sans-serif;
  font-size: 16px;
  transition: background-color 200ms ease, color 200ms ease,
    border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;

  .supports-hover &:hover {
    background-color: rgba(0, 0, 0, 0.07);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.15);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }

  ${props =>
    props.noPadding !== true &&
    css`
      padding: 0 16px;
      line-height: 44px;
      height: 44px;
      min-width: 80px;
    `};

  ${props =>
    props.inline !== true &&
    css`
      width: 100%;
    `};

  ${props =>
    props.primary === true &&
    css`
      color: white;
      background-color: #ff6f6f; /* bgc-coral */
      border: none;

      &[disabled],
      .supports-hover &[disabled]:hover {
        cursor: default;
        background-color: #a69b9b;
        color: rgba(255, 255, 255, 0.5);
      }

      .supports-hover &:hover,
      &:active {
        background-color: #eb6e6e;
      }
    `};
`;

// $FlowFixMe: Flow doesn't yet support React 16.3 features
const Button = React.forwardRef(
  (
    {
      children,
      primary,
      inline,
      iconBefore,
      loading,
      noPadding,
      ...props
    }: Props,
    ref,
  ) => (
    <StyledButton
      noPadding={noPadding}
      primary={primary}
      inline={inline}
      innerRef={ref}
      {...props}>
      {loading ? <CircleLoader small /> : iconBefore}
      {!loading && children}
    </StyledButton>
  ),
);

export default Button;
