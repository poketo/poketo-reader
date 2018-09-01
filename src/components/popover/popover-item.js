// @flow

import React, { type Node } from 'react';
import { css, cx } from 'react-emotion';

const className = css`
  background-color: transparent;
  min-width: 120px;
  max-width: 80vw;
  transition: background-color 200ms ease, color 200ms ease,
    transform 200ms ease, box-shadow 200ms ease;

  .supports-hover &:hover,
  &:active {
    background-color: rgba(0, 0, 0, 0.07);
  }
`;

type Props = {
  iconBefore?: Node,
  onClick?: (SyntheticMouseEvent<HTMLButtonElement>) => void,
  label: string,
  href?: string,
};

const PopoverItem = ({ iconBefore, onClick, label, ...props }: Props) => {
  const Component = typeof props.href === 'string' ? 'a' : 'button';

  return (
    <Component
      className={cx(className, 'br-3 x xa-center ta-left pr-3 w-100p', {
        'pl-3': !Boolean(iconBefore),
      })}
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
