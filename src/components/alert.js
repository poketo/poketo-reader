// @flow

import React, { type Node } from 'react';
import { cx } from 'react-emotion';

type Props = {
  className?: string,
  children: Node,
};

const Alert = ({ children, className, ...rest }: Props) => (
  <div
    className={cx(
      className,
      'd-inlineBlock pv-2 ph-3 bgc-extraFadedLightCoral c-darkCoral fs-16 br-4',
    )}
    {...rest}>
    {children}
  </div>
);

export default Alert;
