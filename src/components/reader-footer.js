// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/icon';
import utils from '../utils';

type Props = {
  collectionSlug: ?string,
};

const ReaderFooter = ({ collectionSlug }: Props) => (
  <nav className="x xj-spaceBetween bgc-black c-white ta-center pv-4 ph-3 fs-14 fs-16-m">
    <Link
      className="o-50p"
      to={collectionSlug ? utils.getCollectionUrl(collectionSlug) : '/'}>
      <Icon name="arrow-left" iconSize={20} />
    </Link>
    <div />
  </nav>
);

export default ReaderFooter;
