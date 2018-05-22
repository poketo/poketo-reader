// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import IconNewTab from '../components/icon-new-tab';
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
      <Link to="/feedback" className="Link mr-3 mr-0-m">
        Feedback
      </Link>
    </div>
    <div className="x xa-center">
      <a
        href={config.githubUrl}
        className="hover va-baseline"
        target="_blank"
        rel="noopener noreferrer">
        <span className="Link Link--noFade">Github</span>
        <span>
          <IconNewTab width={14} height={14} />
        </span>
      </a>
    </div>
  </div>
);

export default Footer;
