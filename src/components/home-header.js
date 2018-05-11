// @flow

import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import IconNewTab from '../components/icon-new-tab';
import IconPoketo from '../components/icon-poketo';
import IconPoketoWordmark from '../components/icon-poketo-wordmark';
import config from '../config';

type Props = {
  overlay?: boolean,
};

const Header = ({ overlay = false }: Props) => (
  <header
    className={classNames('x xj-spaceBetween pt-4 pb-3 ph-3 mw-900 mh-auto', {
      'p-absolute l-0 r-0 z-9 c-black': overlay,
    })}>
    <Link to="/">
      <div className="x xa-center c-coral">
        <IconPoketo height={32} className="c-coral" />
        {overlay === false && (
          <IconPoketoWordmark
            className="c-black ml-2"
            width={100}
            height={32}
          />
        )}
      </div>
    </Link>
    <nav>
      <Link to="/" className="mr-3">
        Hello
      </Link>
      <Link to="/about" className="mr-3">
        About
      </Link>
      <a href={config.githubUrl} target="_blank" rel="noopener noreferrer">
        Github
        <IconNewTab width={18} height={18} />
      </a>
    </nav>
  </header>
);

export default Header;
