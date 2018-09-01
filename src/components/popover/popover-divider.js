// @flow

import React from 'react';
import styled from 'react-emotion';

const offset = 8;

const Divider = styled.div`
  height: 1px;
  margin-left: -${offset}px;
  margin-right: -${offset}px;
  width: calc(100% + ${offset * 2}px);
`;

const PopoverDivider = () => <Divider className="bgc-gray1 mv-2" />;

export default PopoverDivider;
