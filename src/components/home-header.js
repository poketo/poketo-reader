// @flow

import React, { Component } from 'react';
import { cx } from 'react-emotion/macro';
import { Link, NavLink, Route } from 'react-router-dom';

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
        className={cx({
          'p-absolute l-0 r-0 z-4 c-black': overlay,
        })}>
        <div className="x xj-spaceBetween pa-3">
          <Link to="/">
            <div className="x xa-center c-coral">
              <IconPoketo width={24} height={24} />
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
            <NavLink to="/about" activeClassName="o-50p">
              About
            </NavLink>
            <Route
              path="/login"
              children={({ match }) => (
                <Link to="/login" className={cx('ml-3', { 'o-50p': match })}>
                  Log In
                </Link>
              )}
            />
          </nav>
        </div>
      </header>
    );
  }
}
