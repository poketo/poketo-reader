// @flow

import React from 'react';
import AutosizeTextArea from 'react-textarea-autosize';
import classNames from 'classnames';
import './text-area.css';

type Props = {
  className?: string,
  disabled?: boolean,
};

const TextArea = ({ className, disabled, ...rest }: Props) => (
  <AutosizeTextArea
    className={classNames('TextArea Input', className, { 'bgc-gray0': disabled })}
    disabled={disabled}
    {...rest}
  />
);

export default TextArea;
