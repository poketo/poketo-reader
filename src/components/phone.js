// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';

type Props = {
  direction?: 'left' | 'right',
  children: Node,
};

const Phone = ({ children, direction }: Props) => (
  <div className="Phone-container">
    <div
      className={classNames('Phone', {
        'Phone--facingLeft': direction === 'left',
        'Phone--facingRight': direction === 'right',
      })}>
      <div className="Phone-camera bgc-black br-round" />
      <div className="Phone-speaker bgc-black br-pill" />
      <div className="Phone-homeButton bgc-black br-round" />
      <div className="Phone-screen bgc-white">{children}</div>
    </div>
  </div>
);

export default Phone;
