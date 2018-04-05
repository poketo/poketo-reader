// @flow

import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <footer className="bgc-lightGray">
    <div className="mw-900 mh-auto pv-4 ph-3 ph-0-m fs-12 ta-center">
      <a className="Link mr-3" href="https://github.com/poketo/site">
        Github
      </a>
      <Link to="/about" className="Link mr-3">
        About
      </Link>
      <Link to="https://github.com/poketo/site/releases" className="Link">
        Changelog
      </Link>
    </div>
  </footer>
);
