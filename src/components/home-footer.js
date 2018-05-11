// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import IconNewTab from '../components/icon-new-tab';
import config from '../config';

type Props = {};

const Footer = (props: Props) => (
  <div className="x xj-spaceBetween pv-5 fs-14">
    <div>
      <a href={`mailto:${config.email}`}>{config.email}</a>
    </div>
    <div>
      <Link to="/" className="Link mr-3">
        Hello
      </Link>
      <Link to="/about" className="Link mr-3">
        About
      </Link>
      <a href={config.githubUrl} className="hover mr-3 va-baseline">
        <span className="Link Link--noFade">Github</span>
        <span>
          <IconNewTab width={14} height={14} />
        </span>
      </a>
    </div>
  </div>
);

export default Footer;
