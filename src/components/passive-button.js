// @flow

import React from 'react';

type Props = {};

const PassiveButton = (props: Props) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a
    className="fs-14 c-gray3 c-pointer hover-bg"
    css={`
      border: 1px transparent solid;
      border-radius: 3px;
      padding: 4px 6px 3px;
      user-select: none;
    `}
    {...props}
  />
);

export default PassiveButton;
