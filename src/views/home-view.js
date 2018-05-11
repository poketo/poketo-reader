// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import HomeIntro from '../components/home-intro';
import HomeSubscribeForm from '../components/home-subscribe-form';
import IconPoketo from '../components/icon-poketo';
import Phone from '../components/phone';
import Header from '../components/home-header';
import Footer from '../components/home-footer';
import ScrollReset from '../components/scroll-reset';

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

  render() {
    const { highlightedFeature } = this.state;

    return (
      <div className="mh-100vh c-gray4 bgc-offwhite fs-18">
        <ScrollReset />
        <div className="x xd-column pb-5">
          <Header overlay />
          <HomeIntro onRequestButtonClick={this.handleRequestButtonClick} />
          <div className="mw-900 mh-auto ta-center pt-6 pb-4 ph-3">
            <p className="fs-32">A friendly web manga reader</p>
          </div>
          <div className="x xa-center xj-center mw-900 mh-auto pv-5">
            <FeatureBlock
              className="ta-right"
              highlighted={highlightedFeature === 'follow'}
              onClick={this.handleFeatureClick('follow')}
              title="Follow"
              description="Track manga series across the web with a feed of new releases."
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
              <h3 className="fw-semibold">Easy reading</h3>
              <p>Supports thousands of series from sites across the web.</p>
            </div>
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold">˗ˏˋ Light and fun ˎˊ˗</h3>
              <p>No ads, no downloads, no accounts. Niiice and simple.</p>
            </div>
            <div className="w-33p-m ph-4 pv-3">
              <h3 className="fw-semibold">Open source</h3>
              <p>
                Built as an{' '}
                <a className="Link" href="https://github.com/poketo/site">
                  open source project
                </a>. Help out or fork it!
              </p>
            </div>
          </div>
          <div className="mw-600 w-90p mh-auto pv-5">
            <p className="mb-4 w-75p mh-auto ta-center">
              Interested?<br />Enter your email below to get an&nbsp;invite when
              it’s ready.
            </p>
            <HomeSubscribeForm />
            <p className="fs-12 o-50p ta-center mt-3">No spam, promise.</p>
          </div>
          <div className="mw-600 w-90p mh-auto">
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}
