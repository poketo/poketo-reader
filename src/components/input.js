// @flow

import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
};

const Input = ({ className, ...props }: Props) => (
  <input
    className={classNames('Input', 'br-3 ff-sans', className)}
    {...props}
  />
);

export default Input;
