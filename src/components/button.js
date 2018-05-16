// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';
import CircleLoader from './loader-circle';

type Props = {
  children?: Node,
  className?: string,
  primary?: boolean,
  inline?: boolean,
  loading?: boolean,
  white?: boolean,
};

export default ({
  className,
  children,
  primary = false,
  inline = false,
  loading = false,
  white = false,
  ...props
}: Props) => (
  <button
    className={classNames('Button', 'br-3 ff-sans', className, {
      'Button--primary bgc-coral': primary,
      'Button--white': white,
      'Button--loading': loading,
      'Button--inline': inline,
    })}
    {...props}>
    {loading ? <CircleLoader color="white" small /> : children}
  </button>
);
