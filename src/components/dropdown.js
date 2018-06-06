// @flow

import React from 'react';
import Icon from './icon';

import './dropdown.css';

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
      <Icon name="direct-down" iconSize={16} size={34} />
    </div>
  </div>
);

export default Dropdown;
