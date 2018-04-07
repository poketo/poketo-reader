// @flow

import React, { Component } from 'react';

import Button from '../components/button';
import Footer from '../components/footer';
import poketoIntroUrl from '../assets/poketo-intro.svg';

type Props = {};

export default class HomeView extends Component<Props> {
  render() {
    return (
      <div className="x xd-column xj-spaceBetween mh-100vh">
        <div style={{ backgroundColor: '#fc9377' }}>
          <div className="mw-900 mh-auto ta-center c-white pv-5 ph-3 ph-0-m">
            <div className="mb-4">
              <img
                src={poketoIntroUrl}
                className="us-none ud-none pr-2 va-middle"
                alt="Poketo"
                width="160"
              />
              <span className="br-4 ba-1 bc-lightGray ph-2 pv-1 ff-mono fs-12 ls-loose tt-uppercase">
                Beta
              </span>
            </div>
            <p className="fs-24">
              A friendly manga tracker for following series you like.
            </p>
            <div className="mv-4">
              <Button white inline>
                Request an invite
              </Button>
            </div>
          </div>
        </div>
        <div className="mw-900 mh-auto pv-5 ph-3 ph-0-m">
          <div className="x-m">
            <div className="mb-4 mb-0-m">
              <h3>Light and fun</h3>
              <p>No ads, no downloads, no accounts. Simple.</p>
            </div>
            <div className="mb-4 mb-0-m">
              <h3>Easy reading</h3>
              <p>Supports thousands of series from 8 sites (and counting).</p>
            </div>
            <div className="mb-4 mb-0-m">
              <h3>Open source</h3>
              <p>
                Built with open source; released as an{' '}
                <a className="Link" href="https://github.com/poketo/site">
                  open source
                </a>{' '}
                project.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
