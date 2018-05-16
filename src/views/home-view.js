// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import { CSSTransition } from 'react-transition-group';
import config from '../config';
import featureFeedUrl from '../assets/feature-feed.png';
import featureReaderUrl from '../assets/feature-reader.png';
import Button from '../components/button';
import Footer from '../components/home-footer';
import Header from '../components/home-header';
import HomeIntro from '../components/home-intro';
import HomeLayout from '../components/home-layout';
import Phone from '../components/phone';
import ScrollReset from '../components/scroll-reset';

import '../styles/home.css';

type FeatureId = 'follow' | 'read';

type Props = {};
type State = {
  highlightedFeature: FeatureId,
};

const FeatureBlock = ({
  className,
  highlighted,
  onClick,
  title,
  description,
}) => (
  <button
    className={classNames(
      className,
      'mw-600 w-50p w-25p-m ph-2 mw-250',
      highlighted === false && 'c-gray3',
    )}
    onClick={onClick}>
    <h4 className="fw-semibold fs-18 fs-21-m mb-3">{title}</h4>
    <p className="fs-16 fs-18-m">{description}</p>
  </button>
);

export default class HomeView extends Component<Props, State> {
  state = {
    highlightedFeature: 'follow',
  };

  handleFeatureClick = (featureId: FeatureId) => () => {
    this.setState({ highlightedFeature: featureId });
  };

  render() {
    const { highlightedFeature } = this.state;

    return (
      <HomeLayout>
        <ScrollReset />
        <div className="x xd-column pb-5">
          <Header overlay />
          <HomeIntro />
          <div className="mw-900 mh-auto ta-center pt-5 pt-6-m pb-3 pb-4-m ph-3">
            <p className="fs-24 fs-32-m">A friendly web manga&nbsp;reader</p>
          </div>
          <div className="mw-900 w-90p mh-auto pv-5 ta-center x xd-column xd-row-m xw-wrap">
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2">Easy reading</h3>
              <p>Supports thousands of series from sites across the web.</p>
            </div>
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2 ml--24 ml-0-m">
                ˗ˏˋ Light and fun ˎˊ˗
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
          <div
            className="bs-100p bs-80p-m"
            style={{
              background: `url(${require('../assets/phone-bg.svg')}) center center no-repeat`,
            }}>
            <div className="x xw-wrap xa-start xa-center-m xj-center mw-900 mh-auto pv-5 w-90p">
              <FeatureBlock
                className="xo-1 ta-left ta-right-m"
                highlighted={highlightedFeature === 'follow'}
                onClick={this.handleFeatureClick('follow')}
                title="Follow"
                description="Track series with a feed of new releases."
              />
              <div className="pv-4 pv-0-m ph-5 xo-3 xo-2-m c-coral">
                <Phone
                  direction={
                    highlightedFeature === 'follow' ? 'left' : 'right'
                  }>
                  {highlightedFeature === 'follow' ? (
                    <CSSTransition timeout={300} classNames="fade">
                      <img
                        alt="Track series you follow with a feed of new releases."
                        src={featureFeedUrl}
                      />
                    </CSSTransition>
                  ) : (
                    <CSSTransition timeout={300} classNames="fade">
                      <img
                        alt="Read chapters free from distractions. Neat!"
                        src={featureReaderUrl}
                      />
                    </CSSTransition>
                  )}
                </Phone>
              </div>
              <FeatureBlock
                className="xo-2 xo-3-m ta-left"
                highlighted={highlightedFeature === 'read'}
                onClick={this.handleFeatureClick('read')}
                title="Read"
                description="Read chapters free from distractions. Neat!"
              />
            </div>
          </div>
          <div className="mw-500 w-75p mh-auto pv-5 ta-center">
            <h4 className="mb-2 fw-semibold">Interested?</h4>
            <p className="mb-4">
              Poketo is still in development, but I am slowly inviting people.
              Fill out this survey and include your email for a beta invite.
            </p>
            <a
              href={config.researchSurveyUrl}
              target="_blank"
              rel="noopener noreferrer">
              <Button primary inline>
                Fill out the survey
              </Button>
            </a>
          </div>
          <div className="mw-600 w-90p mh-auto">
            <Footer />
          </div>
        </div>
      </HomeLayout>
    );
  }
}
