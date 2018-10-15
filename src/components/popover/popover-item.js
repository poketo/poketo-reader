// @flow

import React, { type Node } from 'react';
import { css, cx } from 'react-emotion/macro';

const className = css`
  min-width: 120px;
  max-width: 80vw;
  height: 44px;
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
      className={cx(
        className,
        'br-3 x xa-center ta-left pr-3 w-100p hover-bg',
        {
          'pl-3': !Boolean(iconBefore),
        },
      )}
      onClick={onClick}
      title={label}
      {...props}>
      {iconBefore}
      {label}
    </Component>
  );
};

export default PopoverItem;
