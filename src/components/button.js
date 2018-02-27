import React from 'react';

export default ({ className, ...props }) => (
  <button className={`Button ${className}`} {...props} />
);
