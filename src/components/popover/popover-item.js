// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';

type Props = {
  iconBefore?: Node,
  onClick?: (SyntheticMouseEvent<HTMLButtonElement>) => void,
  label: string,
  href?: boolean,
};

const PopoverItem = ({ iconBefore, onClick, label, ...props }: Props) => {
  const Component = typeof props.href === 'string' ? 'a' : 'button';

  return (
    <Component
      className={classNames(
        'PopoverItem',
        'br-3 x xa-center ta-left pr-3 w-100p',
        {
          'pl-3': !Boolean(iconBefore),
        },
      )}
      style={{ height: 44 }}
      onClick={onClick}
      title={label}
      {...props}>
      {iconBefore}
      {label}
    </Component>
  );
};

export default PopoverItem;
