// @flow

import React from 'react';
import styled, { cx } from 'react-emotion';
import AutosizeTextArea from 'react-textarea-autosize';

type Props = {
  className?: string,
  disabled?: boolean,
};

const StyledTextArea = styled(AutosizeTextArea)`
  border-radius: 4px;
  padding: 12px;
  line-height: 1.5;
  resize: none;

  &[disabled] {
    background: #fafafa;
  }
`;

const TextArea = ({ className, disabled, ...rest }: Props) => (
  <StyledTextArea
    className={cx('Input', className, {
      'bgc-gray0': disabled,
    })}
    disabled={disabled}
    {...rest}
  />
);

export default TextArea;
