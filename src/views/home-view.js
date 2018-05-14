// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import axios from 'axios';

import { CSSTransition } from 'react-transition-group';
import config from '../config';
import featureFeedUrl from '../assets/feature-feed.png';
import featureReaderUrl from '../assets/feature-reader.png';
import Button from '../components/button';
import Footer from '../components/home-footer';
import Header from '../components/home-header';
import HomeIntro from '../components/home-intro';
import IconCheck from '../components/icon-check-circle';
import Input from '../components/input';
import Phone from '../components/phone';
import ScrollReset from '../components/scroll-reset';

import '../styles/home.css';

type FeatureId = 'follow' | 'read';

type Props = {};
type State = {
  highlightedFeature: FeatureId,
  status: 'idle' | 'submitting' | 'error' | 'success',
  email: string,
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
      highlighted === false && 'o-50p',
    )}
    onClick={onClick}>
    <h4 className="fw-semibold fs-18 fs-21-m mb-3">{title}</h4>
    <p className="fs-16 fs-18-m">{description}</p>
  </button>
);

export default class HomeView extends Component<Props, State> {
  state = {
    highlightedFeature: 'follow',
    status: 'idle',
    email: '',
  };

  handleRequestButtonClick = () => {
    const input = document.querySelector('input[type="email"]');
    if (input) {
      input.focus();
    }
  };

  handleFeatureClick = (featureId: FeatureId) => () => {
    this.setState({ highlightedFeature: featureId });
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = this.state.email.trim();

    if (email.length < 1) {
      this.setState({ status: 'error' });
      return;
    }

    this.setState({ status: 'submitting' });

    axios
      .post(config.inviteUrl, {
        fields: { Email: email.trim() },
      })
      .then(res => {
        this.setState({ status: 'success' });
      })
      .catch(err => {
        console.log(err);
        this.setState({ status: 'error' });
      });
  };

  handleEmailChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value });
  };

  render() {
    const { highlightedFeature, email, status } = this.state;

    return (
      <div className="mh-100vh c-gray4 bgc-offwhite fs-16 fs-18-m">
        <ScrollReset />
        <div className="x xd-column pb-5">
          <Header overlay />
          <HomeIntro onRequestButtonClick={this.handleRequestButtonClick} />
          <div className="mw-900 mh-auto ta-center pt-5 pt-6-m pb-3 pb-4-m ph-3">
            <p className="fs-24 fs-32-m">A friendly web manga&nbsp;reader</p>
          </div>
          <div
            className="bs-100p bs-60p-m"
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
              <div className="pv-4 pv-0-m ph-5 xo-3 xo-2-m">
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
          <div className="mw-900 mh-auto pv-5 ta-center-m x xd-column xd-row-m xw-wrap">
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2">Easy reading</h3>
              <p>
                Supports thousands of series from{' '}
                <a className="Link" href={config.githubSupportedSites}>
                  sites across the web
                </a>.
              </p>
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
          <div className="mw-600 w-90p mh-auto pv-5">
            {status === 'success' ? (
              <div className="ta-center">
                <IconCheck width="1.5em" height="1.5em" />
                <div className="mt-2 va-bottom">Success!</div>
              </div>
            ) : (
              <form onSubmit={this.handleSubmit}>
                <p className="mb-4 w-75p mh-auto ta-center">
                  Interested?<br />Enter your email for an&nbsp;invite to test
                  it out.
                </p>
                <div className="x-m">
                  <Input
                    className="bgc-white"
                    placeholder="Enter your email..."
                    required
                    type="email"
                    value={email}
                    onChange={this.handleEmailChange}
                  />
                  <div className="mt-2 mt-0-m ml-2-m w-33p-m">
                    <Button
                      className="d-block"
                      type="submit"
                      loading={status === 'submitting'}>
                      Request invite
                    </Button>
                  </div>
                </div>
                {status === 'error' ? (
                  <div className="ta-center fs-14 mt-3">
                    Something went wrong. Try again later.
                  </div>
                ) : (
                  <p className="fs-12 o-50p ta-center mt-3">
                    No spam, promise.
                  </p>
                )}
              </form>
            )}
          </div>
          <div className="mw-600 w-90p mh-auto">
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
