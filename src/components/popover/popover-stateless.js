// @flow

import React, { type Node } from 'react';
import styled, { cx } from 'react-emotion';

const StyledPopover = styled.div`
  min-width: 100px;
  z-index: 99;
`;

type Props = {
  className?: string,
  children?: Node,
};

// $FlowFixMe
const PopoverStateless = React.forwardRef(
  ({ className, children, ...props }: Props, ref) => (
    <StyledPopover
      role="dialog"
      className={cx(
        'bgc-white e-2 br-4 x xa-center xj-center of-hidden',
        className,
      )}
      innerRef={ref}
      {...props}>
      {children}
    </StyledPopover>
  ),
);

export default PopoverStateless;
