// @flow

import React from 'react';
import IconDirectDown from './icon-direct-down';

type Props = {
  onChange: (e: SyntheticInputEvent<HTMLSelectElement>) => void,
  options: Array<{
    label: string,
    value: string,
  }>,
  value: string,
};

const Dropdown = ({ options, onChange, value, ...props }: Props) => (
  <div className="Dropdown x" {...props}>
    <select
      className="Dropdown-select ff-sans"
      onChange={onChange}
      value={value}>
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <div className="Dropdown-arrow x">
      <IconDirectDown width={16} height={16} />
    </div>
  </div>
);

export default Dropdown;
