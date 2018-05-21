// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';

type Props = {
  children: Node,
  className?: string,
};

const Phone = ({ children, className, ...props }: Props) => (
  <div className={classNames('Phone-container', className)} {...props}>
    <div className="Phone paper-shadow">
      <div className="Phone-camera br-round" />
      <div className="Phone-speaker br-pill" />
      <div className="Phone-homeButton br-round" />
      <div className="Phone-screen bgc-white">{children}</div>
    </div>
  </div>
);

export default Phone;
