// @flow

import React from 'react';
import classNames from 'classnames';
import './loader-circle.css';

type Props = {
  className?: string,
  small?: boolean,
};

const CircleLoader = ({ className, small = false }: Props) => (
  <div
    className={classNames(
      'CircleLoader',
      'br-round',
      small === false ? 'w-36 h-36 ba-4' : 'w-16 h-16 ba-2',
      className,
    )}
  />
);

export default CircleLoader;
