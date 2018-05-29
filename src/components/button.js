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
  white: boolean,
  small: boolean,
  noPadding: boolean,
};

// $FlowFixMe: Flow doesn't yet support React 16.3 features
const Button = React.forwardRef(
  (
    {
      className,
      children,
      primary,
      inline,
      iconBefore,
      loading,
      white,
      small,
      noPadding,
      ...props
    }: Props,
    ref,
  ) => (
    <button
      className={classNames(
        'Button',
        'br-3 ff-sans',
        {
          'Button--primary bgc-coral': primary,
          'Button--loading': loading,
          'Button--inline': inline,
          'Button--small': small,
          'Button--noPadding': noPadding,
        },
        className,
      )}
      ref={ref}
      {...props}>
      {loading ? <CircleLoader color="white" small /> : iconBefore}
      {!loading && children}
    </button>
  ),
);

Button.defaultProps = {
  primary: false,
  inline: false,
  loading: false,
  white: false,
  small: false,
  noPadding: false,
};

export default Button;
