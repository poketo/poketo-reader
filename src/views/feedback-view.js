// @flow

import React, { Component } from 'react';
import Head from 'react-helmet';
import axios from 'axios';

import config from '../config';
import Button from '../components/button';
import Header from '../components/home-header';
import HomeLayout from '../components/home-layout';
import TextArea from '../components/text-area';

type Props = {};
type State = {
  feedback: string,
  status: 'idle' | 'fetching' | 'success' | 'error',
};

export default class FeedbackView extends Component<Props, State> {
  state = {
    feedback: '',
    status: 'idle',
  };

  handleFeedbackChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ feedback: e.currentTarget.value });
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const feedback = this.state.feedback;

    this.setState({ status: 'fetching' });
    this.sendFeedback(feedback)
      .then(() => {
        this.setState({ status: 'success' });
      })
      .catch(() => {
        this.setState({ status: 'error' });
      });
  };

  sendFeedback = (message: string) =>
    axios.post(`${config.apiFeedbackUrl}/v0/Feedback`, {
      fields: {
        Feedback: message,
        Page: window.location.pathname,
        Collection: null,
      },
    });

  render() {
    const { feedback, status } = this.state;

    return (
      <HomeLayout>
        <Head>
          <title>Feedback</title>
        </Head>
        <Header />
        <form className="mt-5 ph-3 mw-500 mh-auto" onSubmit={this.handleSubmit}>
          <p className="mb-3">Share any feedback about Poketo here.</p>
          <div className="mb-2">
            <TextArea
              placeholder="Feedback..."
              disabled={status !== 'idle'}
              autoFocus
              minRows={2}
              onChange={this.handleFeedbackChange}
              value={feedback}
            />
          </div>
          <Button
            type="Submit"
            disabled={status !== 'idle'}
            primary
            inline
            small
            loading={status === 'fetching'}>
            {status === 'success' ? 'Sent! Thanks!' : 'Send'}
          </Button>
        </form>
      </HomeLayout>
    );
  }
}
