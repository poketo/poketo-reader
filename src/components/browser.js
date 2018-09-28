// @flow

import React, { type Node } from 'react';
import { cx } from 'react-emotion/macro';

type Props = {
  children: Node,
  className?: string,
};

const Browser = ({ children, className, ...props }: Props) => (
  <div className={cx('Browser-container', className)} {...props}>
    <div className="Browser paper-shadow">
      <div className="Browser-button br-round" />
      <div className="Browser-button br-round" />
      <div className="Browser-button br-round" />
      <div className="Browser-screen bgc-white">{children}</div>
    </div>
  </div>
);

export default Browser;
