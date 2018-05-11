// @flow

import React, { Component } from 'react';
import Head from 'react-helmet';
import { Link } from 'react-router-dom';

import Button from '../components/button';
import poketoIntroUrl from '../assets/poketo-intro.svg';

type Props = {};

export default class HomeView extends Component<Props> {
  render() {
    return (
      <div className="mh-100vh x xj-center xa-center c-gray4">
        <Head>
          <body className="bgc-coral" />
        </Head>
        <img
          src={poketoIntroUrl}
          className="us-none ud-none pr-2 va-middle t-shrinkOnActive c-white"
          alt="Poketo"
          width="200"
        />
      </div>
    );
  }
}
