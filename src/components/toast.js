// @flow

import React, { type Node } from 'react';
import './toast.css';

type Props = {
  children?: Node,
};

const Toast = (props: Props) => (
  <div className="Toast e-2 bgc-white fs-14 br-4 pa-2 ta-center mh-auto">
    {props.children}
  </div>
);

export default Toast;
