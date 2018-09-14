// @flow

import React, { Component } from 'react';
import { type RouterHistory, type Match } from 'react-router-dom';

import backgroundUrl from '../assets/background.svg';
import previewFeedUrl from '../assets/home-preview-feed.png';
import previewReadUrl from '../assets/home-preview-read.jpg';

import config from '../config';
import AuthRedirect from '../components/auth-redirect';
import Button from '../components/button';
import Footer from '../components/home-footer';
import Header from '../components/home-header';
import HomeIntro from '../components/home-intro';
import HomeLayout from '../components/home-layout';
import Phone from '../components/phone';
import Browser from '../components/browser';
import ScrollReset from '../components/scroll-reset';

import '../styles/home.css';

type Props = {
  history: RouterHistory,
  match: Match,
};

class HomeView extends Component<Props> {
  render() {
    return (
      <HomeLayout>
        <ScrollReset />
        <AuthRedirect
          redirect={this.props.match.path === '/'}
          history={this.props.history}
        />
        <div className="pb-5">
          <Header overlay />
          <HomeIntro />
          <div className="mw-900 mh-auto ta-center pt-5 pt-6-m pb-3 pb-4-m ph-3">
            <p className="fs-24 fs-32-m">A friendly web manga&nbsp;reader</p>
          </div>
          <div
            className="p-relative x xj-center xa-center of-hidden w-100p pv-0 pv-4-m"
            style={{
              backgroundImage: `url(${backgroundUrl})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}>
            <Phone className="HomePhonePreview">
              <img src={previewFeedUrl} alt="Poketo Feed" />
            </Phone>
            <div style={{ maxWidth: 700, minHeight: 500 }}>
              <Browser className="HomeBrowserPreview">
                <img src={previewReadUrl} alt="Poketo Reader" />
              </Browser>
            </div>
          </div>
          <div className="mw-900 w-90p mh-auto pv-5 ta-center x xd-column xd-row-m xw-wrap">
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2">Easy reading</h3>
              <p>Supports thousands of series from sites across the web.</p>
            </div>
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2 ml-0-m">
                ˗ˏˋ&nbsp;Light&nbsp;and&nbsp;fun&nbsp;ˎˊ˗
              </h3>
              <p>No ads, no downloads, no accounts. Niiice and simple.</p>
            </div>
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2">Open source</h3>
              <p>
                Built as an{' '}
                <a className="Link" href={config.githubSiteUrl}>
                  open source project
                </a>
                . Help out or fork it!
              </p>
            </div>
          </div>
          <div className="mw-600 w-75p mh-auto pv-5 ta-center">
            <h4 className="mb-2 fw-semibold">Interested?</h4>
            <p className="mb-4">
              Poketo is currently in a private beta.
              <br />
              Reach out if you'd like an invite.
            </p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:hello@poketo.app?subject=Poketo+Invite&body=Hi%2C%20I%27d%20like%20a%20Poketo%20invite.%0A%0A(write%20a%20few%20series%20you%20follow%20here)">
              <Button variant="primary" inline>
                Request an invite
              </Button>
            </a>
          </div>
          <div className="mw-500 ph-3 w-100p mh-auto">
            <Footer />
          </div>
        </div>
      </HomeLayout>
    );
  }
}

export default HomeView;
