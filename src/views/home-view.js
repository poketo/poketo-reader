// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '../components/button';
import poketoIntroUrl from '../assets/poketo-intro.svg';

type Props = {};

export default class HomeView extends Component<Props> {
  render() {
    return (
      <div className="mh-100vh c-gray4 bgc-offwhite">
        <div className="x xd-column pb-6">
          <div className="x xd-column xj-center ta-center pv-5 ph-5 c-white bgc-coral mh-50vh">
            <div className="mb-4">
              <div className="mb-3">
                <span className="br-4 ba-1 bc-lightGray ph-2 pv-1 ff-mono fs-12 ls-loose tt-uppercase">
                  Beta
                </span>
              </div>
              <img
                src={poketoIntroUrl}
                className="us-none ud-none pr-2 va-middle t-shrinkOnActive c-white"
                alt="Poketo"
                width="200"
              />
            </div>
          </div>
          <div className="ta-center pv-5 ph-3 bgc-gray0">
            <div className="mw-900 mh-auto">
              <p className="fs-24">
                A friendly manga tracker for following series you like.
              </p>
            </div>
          </div>
          <div className="mw-900 mh-auto pv-5 x xd-column xd-row-m xw-wrap">
            <div className="w-50p-m ph-3 pv-3">
              <h3 className="fw-medium">Easy reading</h3>
              <p>Supports thousands of series from 8 sites (and counting).</p>
            </div>
            <div className="w-50p-m ph-3 pv-3">
              <h3 className="fw-medium">˗ˏˋ Light and fun ˎˊ˗</h3>
              <p>No ads, no downloads, no accounts. Simple.</p>
            </div>
            <div className="w-50p-m ph-3 pv-3">
              <h3 className="fw-medium">Open source</h3>
              <p>
                Built with open source; released as an{' '}
                <a className="Link" href="https://github.com/poketo/site">
                  open source
                </a>{' '}
                project.
              </p>
            </div>
          </div>
          <div className="p-fixed b-0 w-100p pv-4 ph-4 ta-center">
            <Button>
              Request an invite
            </Button>
          </div>
          <div className="pv-3 fs-14 ta-center">
            <Link to="/about" className="Link mr-3">
              About
            </Link>
            <a
              className="Link mr-3"
              href="https://github.com/poketo/site/issues/new">
              Send feedback
            </a>
            <a className="Link mr-3" href="https://github.com/poketo/site">
              Source
            </a>
          </div>
        </div>
      </div>
    );
  }
}
