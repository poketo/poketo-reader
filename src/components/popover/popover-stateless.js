// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';
import './popover.css';

type Props = {
  className?: string,
  children?: Node,
};

// $FlowFixMe
const PopoverStateless = React.forwardRef(
  ({ className, children, ...props }: Props, ref) => (
    <div
      role="dialog"
      className={classNames(
        'Popover',
        'bgc-white e-2 br-4 x xa-center xj-center pa-2',
        className,
      )}
      ref={ref}
      {...props}>
      {children}
    </div>
  ),
);

export default PopoverStateless;
