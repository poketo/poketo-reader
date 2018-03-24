// @flow

import React from 'react';
import classNames from 'classnames';

type Props = {
  className?: string,
  color?: 'black' | 'white',
  small?: boolean,
};

const CircleLoader = ({ className, color = 'black', small = false }: Props) => (
  <div
    className={classNames(
      'CircleLoader',
      'br-round',
      `c-${color}`,
      small === false ? 'w-36 h-36 ba-4' : 'w-16 h-16 ba-2',
      className,
    )}
  />
);

export default CircleLoader;
