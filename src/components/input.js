// @flow

import React from 'react';

type Props = {
  className: ?string,
};

const Input = ({ className, ...props }: Props) => (
  <input className={`Input ${className ? className : ''}`} {...props} />
);

export default Input;
