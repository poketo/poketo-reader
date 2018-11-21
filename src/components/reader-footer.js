// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/icon';

type Props = {};

const ReaderFooter = (props: Props) => (
  <nav className="x xj-spaceBetween bgc-black c-white ta-center pv-4 ph-3 fs-14 fs-16-m">
    <Link className="o-50p" to="/">
      <Icon name="arrow-left" iconSize={20} />
    </Link>
    <div />
  </nav>
);

export default ReaderFooter;
