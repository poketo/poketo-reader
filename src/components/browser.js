// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';

type Props = {
  children: Node,
  className?: string,
};

const Phone = ({ children, className, ...props }: Props) => (
  <div className={classNames('Browser-container', className)} {...props}>
    <div className="Browser paper-shadow">
      <div className="Browser-button br-round" />
      <div className="Browser-button br-round" />
      <div className="Browser-button br-round" />
      <div className="Browser-screen bgc-white">{children}</div>
    </div>
  </div>
);

export default Phone;
