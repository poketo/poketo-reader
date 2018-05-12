// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import axios from 'axios';

import config from '../config';
import Button from '../components/button';
import Footer from '../components/home-footer';
import Header from '../components/home-header';
import HomeIntro from '../components/home-intro';
import IconPoketo from '../components/icon-poketo';
import Input from '../components/input';
import Phone from '../components/phone';
import ScrollReset from '../components/scroll-reset';

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
      'mw-600 w-25p',
      highlighted === false && 'o-50p',
    )}
    onClick={onClick}>
    <h4 className="fw-semibold mb-3">{title}</h4>
    <p>{description}</p>
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
      <div className="mh-100vh c-gray4 bgc-offwhite fs-18">
        <ScrollReset />
        <div className="x xd-column pb-5">
          <Header overlay />
          <HomeIntro onRequestButtonClick={this.handleRequestButtonClick} />
          <div className="mw-900 mh-auto ta-center pt-5 pt-6-m pb-3 pb-4-m ph-3">
            <p className="fs-24 fs-32-m">A friendly web manga&nbsp;reader</p>
          </div>
          <div className="d-none x-m xa-center xj-center mw-900 mh-auto pv-5">
            <FeatureBlock
              className="ta-right"
              highlighted={highlightedFeature === 'follow'}
              onClick={this.handleFeatureClick('follow')}
              title="Follow"
              description="Track series you follow with a feed of new releases."
            />
            <div className="ph-5">
              <Phone
                direction={highlightedFeature === 'follow' ? 'left' : 'right'}>
                <div className="Navigation pa-2 x xa-center">
                  <IconPoketo className="c-coral" width={18} height={18} />
                </div>
              </Phone>
            </div>
            <FeatureBlock
              className="ta-left"
              highlighted={highlightedFeature === 'read'}
              onClick={this.handleFeatureClick('read')}
              title="Read"
              description="Read series without leaving, in a pleasant reader. Neat!"
            />
          </div>
          <div className="mw-900 mh-auto pv-5 ta-center x xd-column xd-row-m xw-wrap">
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2">Easy reading</h3>
              <p>Supports thousands of series from sites across the web.</p>
            </div>
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2">˗ˏˋ Light and fun ˎˊ˗</h3>
              <p>No ads, no downloads, no accounts. Niiice and simple.</p>
            </div>
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold mb-2">Open source</h3>
              <p>
                Built as an{' '}
                <a className="Link" href="https://github.com/poketo/site">
                  open source project
                </a>. Help out or fork it!
              </p>
            </div>
          </div>
          <div className="mw-600 w-90p mh-auto pv-5">
            {status === 'success' ? (
              <div className="ta-center">
                <div className="fw-semibold">Success!</div>
                <p>We’ll reach out in the coming weeks.</p>
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
