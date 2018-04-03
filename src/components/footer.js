// @flow

import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <footer className="mw-900 mh-auto pv-5 ph-3 ph-0-m fs-12">
    <Link to="/about">About</Link>
    <a href="https://github.com/poketo/site">Source</a>
  </footer>
);
