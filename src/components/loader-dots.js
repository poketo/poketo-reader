// @flow

import React from 'react';
import styled, { keyframes } from 'react-emotion';

const pulse = keyframes`
  0%,
  80%,
  100% {
    background-color: #ccc;
    transform: translateY(-4px);
  }
  40% {
    background-color: #666;
    transform: translateY(0);
  }
`;

const StyledLoader = styled.div`
  display: inline-block;
  text-align: center;
`;

const dotSize = 9;

const StyledDot = styled.div`
  background-color: #666;
  display: inline-block;
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  animation: ${pulse} 1000ms infinite ease-out both;

  & + & {
    margin-left: 6px;
  }

  &:nth-child(1) {
    animation-delay: -320ms;
  }

  &:nth-child(2) {
    animation-delay: -160ms;
  }
`;

const DotLoader = () => (
  <StyledLoader>
    <StyledDot />
    <StyledDot />
    <StyledDot />
  </StyledLoader>
);

export default DotLoader;
