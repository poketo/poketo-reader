// @flow

import React from 'react';
import styled, { cx, keyframes } from 'react-emotion/macro';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const StyledLoader = styled.div`
  display: inline-block;
  border-color: transparent;
  border-top-color: currentColor;
  border-left-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 500ms linear infinite;
  vertical-align: middle;
`;

type Props = {
  className?: string,
  small?: boolean,
};

const CircleLoader = ({ className, small = false }: Props) => (
  <StyledLoader
    className={cx(
      small === false ? 'w-36 h-36 ba-4' : 'w-16 h-16 ba-2',
      className,
    )}
  />
);

export default CircleLoader;
