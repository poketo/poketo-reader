// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import IconNewTab from '../components/icon-new-tab';
import config from '../config';

type Props = {};

const Footer = (props: Props) => (
  <div className="x xd-column xd-row-m ta-center ta-left-m xj-spaceBetween pv-5 fs-14">
    <div className="x xa-center xo-2 mt-2 mt-0-m">
      <a href={`mailto:${config.email}`}>{config.email}</a>
    </div>
    <div className="xo-1 xo-3-m">
      <Link to="/" className="Link mr-3">
        Hello
      </Link>
      <Link to="/about" className="Link mr-3">
        About
      </Link>
      <a
        href={config.githubUrl}
        className="hover va-baseline"
        target="_blank"
        rel="noopener noreferrer">
        <span className="Link Link--noFade">Github</span>
        <span className="d-none d-inlineBlock-m">
          <IconNewTab width={14} height={14} />
        </span>
      </a>
    </div>
  </div>
);

export default Footer;
