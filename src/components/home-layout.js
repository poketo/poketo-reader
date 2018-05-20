// @flow

import React, { type Node } from 'react';

type Props = { children?: Node };

const HomeLayout = ({ children }: Props) => (
  <div className="mh-100vh c-gray4 bgc-offwhite fs-16 fs-18-m">{children}</div>
);

export default HomeLayout;
