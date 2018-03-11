// @flow

import React from 'react';

type Props = {
  className: ?string,
};

export default ({ className, ...props }: Props) => (
  <button className={`Button ${className ? className : ''}`} {...props} />
);
