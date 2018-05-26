// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';
import CircleLoader from './loader-circle';
import './button.css';

type Props = {
  children?: Node,
  className?: string,
  primary: boolean,
  inline: boolean,
  iconBefore?: Node,
  loading: boolean,
  ghost: boolean,
  white: boolean,
  small: boolean,
};

const Button = ({
  className,
  children,
  primary,
  inline,
  iconBefore,
  loading,
  white,
  ghost,
  small,
  ...props
}: Props) => (
  <button
    className={classNames(
      'Button',
      'br-3 ff-sans',
      {
        'Button--primary bgc-coral': primary,
        'Button--white': white,
        'Button--loading': loading,
        'Button--ghost': ghost,
        'Button--inline': inline,
        'Button--small': small,
      },
      className,
    )}
    {...props}>
    {loading ? <CircleLoader color="white" small /> : iconBefore}
    {!loading && children}
  </button>
);

Button.defaultProps = {
  primary: false,
  inline: false,
  loading: false,
  white: false,
  ghost: false,
  small: false,
};

export default Button;
