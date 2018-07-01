// @flow

import React, { type Node } from 'react';
import classNames from 'classnames';

type Props = {
  iconBefore?: Node,
  onClick?: (SyntheticMouseEvent<HTMLButtonElement>) => void,
  label: string,
};

const PopoverItem = (props: Props) => (
  <button
    className={classNames(
      'PopoverItem',
      'br-3 x xa-center ta-left pr-3 w-100p',
      {
        'pl-3': !Boolean(props.iconBefore),
      },
    )}
    style={{ height: 44 }}
    onClick={props.onClick}
    title={props.label}>
    {props.iconBefore}
    {props.label}
  </button>
);

export default PopoverItem;
