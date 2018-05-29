// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config';

type Props = {};

const Footer = (props: Props) => (
  <div className="x xa-center ta-center ta-left-m xj-center xj-spaceBetween-m pv-5 fs-14">
    <div>
      <Link to="/" className="Link mr-3">
        Hello
      </Link>
      <Link to="/about" className="Link mr-3">
        About
      </Link>
      <a
        href={`mailto:${config.email}`}
        className="Link mr-3 mr-0-m"
        target="_blank"
        rel="noreferrer noopener">
        Email
      </a>
    </div>
    <div className="x xa-center">
      <a
        className="Link"
        href={config.githubSiteUrl}
        target="_blank"
        rel="noopener noreferrer">
        Github
      </a>
    </div>
  </div>
);

export default Footer;
