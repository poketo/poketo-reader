import React, { type Node } from 'react';

type Props = {
  children?: Node,
};

const Toast = (props: Props) => (
  <div className="bgc-yellow fs-12 br-4 pa-2 ta-center">{props.children}</div>
);

export default Toast;
