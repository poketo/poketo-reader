// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';

import IconPoketo from '../components/icon-poketo';
import IconPoketoWordmark from '../components/icon-poketo-wordmark';
import utils from '../utils';

type Props = {
  overlay?: boolean,
};

type State = {
  isLogInPanelOpen: boolean,
};

export default class Header extends Component<Props, State> {
  static defaultProps = {
    overlay: false,
  };

  render() {
    const { overlay } = this.props;

    return (
      <header
        className={classNames('x xj-spaceBetween pa-3', {
          'p-absolute l-0 r-0 z-9 c-black': overlay,
        })}>
        <Link to="/">
          <div className="x xa-center c-coral">
            <IconPoketo height={32} />
            {overlay === false && (
              <IconPoketoWordmark className="c-black ml-2" width={100} height={32} />
            )}
          </div>
        </Link>
        <nav className="x xa-center">
          <NavLink to="/about" activeClassName="o-50p">
            About
          </NavLink>
          {utils.isStandalone() && (
            <Link className="ml-3" to="/login">
              Log In
            </Link>
          )}
        </nav>
      </header>
    );
  }
}
