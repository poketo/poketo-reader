// @flow

import React from 'react';

type Props = {
  className?: string,
  primary: boolean,
};

export default ({ className, primary = false, ...props }: Props) => (
  <button
    className={`Button ${primary ? 'Button--primary' : ''} ff-sans ${
      className ? className : ''
    }`}
    {...props}
  />
);
