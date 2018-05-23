// @flow

import React, { Component } from 'react';

import backgroundUrl from '../assets/background.svg';
import previewFeedUrl from '../assets/home-preview-feed.png';
import previewReadUrl from '../assets/home-preview-read.jpg';

import config from '../config';
import Button from '../components/button';
import Footer from '../components/home-footer';
import Header from '../components/home-header';
import HomeIntro from '../components/home-intro';
import HomeLayout from '../components/home-layout';
import Phone from '../components/phone';
import Browser from '../components/browser';
import ScrollReset from '../components/scroll-reset';

import '../styles/home.css';

type Props = {};

export default class HomeView extends Component<Props> {
  render() {
    return (
      <HomeLayout>
        <ScrollReset />
        <div className="x xd-column pb-5">
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
                </a>. Help out or fork it!
              </p>
            </div>
          </div>
          <div className="mw-600 w-75p mh-auto pv-5 ta-center">
            <h4 className="mb-2 fw-semibold">Interested?</h4>
            <p className="mb-4">
              Fill out this survey and include your email for a beta invite.
            </p>
            <a
              href={config.researchSurveyUrl}
              target="_blank"
              rel="noopener noreferrer">
              <Button primary inline>
                Fill out survey
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
