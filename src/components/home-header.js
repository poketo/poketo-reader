// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import IconPoketo from '../components/icon-poketo';
import IconPoketoWordmark from '../components/icon-poketo-wordmark';

type Props = {
  overlay?: boolean,
};

export default class Header extends Component<Props> {
  static defaultProps = {
    overlay: false,
  };

  render() {
    const { overlay } = this.props;

    return (
      <header
        className={classNames(
          'x xj-spaceBetween pt-4 pb-3 ph-3 mw-900 mh-auto',
          {
            'p-absolute l-0 r-0 z-9 c-black': overlay,
          },
        )}>
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
        <nav className="x xa-center">
          <NavLink to="/about" className="mr-3" activeClassName="c-coral">
            About
          </NavLink>
          <Link to="/login">Log In</Link>
        </nav>
      </header>
    );
  }
}
