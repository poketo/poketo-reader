// @flow

import React, { type Node } from 'react';
import styled, { cx } from 'react-emotion/macro';

const StyledPopover = styled.div`
  min-width: 100px;
`;

type Props = {
  className?: string,
  children?: Node,
};

const PopoverStateless = React.forwardRef<Props, HTMLDivElement>(
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
