// @flow

import React from 'react';
import { cx } from 'react-emotion';

type Props = {
  className?: string,
};

const Input = ({ className, ...props }: Props) => (
  <input className={cx('Input', 'br-3 ff-sans', className)} {...props} />
);

export default Input;
