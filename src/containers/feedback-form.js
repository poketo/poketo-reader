// @flow

import React, { Component } from 'react';
import axios from 'axios';

import config from '../config';
import Button from '../components/button';
import TextArea from '../components/text-area';

type Props = {};
type State = {
  feedback: string,
  status: 'idle' | 'fetching' | 'success' | 'error',
};

export default class FeedbackForm extends Component<Props, State> {
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

    if (feedback.trim().length < 1) {
      return;
    }

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
      <form onSubmit={this.handleSubmit}>
        <p className="mb-3">
          We‘d love to hear any feedback you have about Poketo. You can also{' '}
          <a
            className="Link"
            href={`mailto:${config.email}`}
            target="_blank"
            rel="noopener noreferer">
            email if you'd prefer
          </a>.
        </p>
        <div className="mb-2">
          <TextArea
            placeholder="Feedback..."
            disabled={status !== 'idle'}
            minRows={2}
            onChange={this.handleFeedbackChange}
            value={feedback}
          />
        </div>
        <Button
          type="Submit"
          disabled={status !== 'idle' || feedback.trim().length < 5}
          loading={status === 'fetching'}
          primary>
          {status === 'success' ? 'Sent! Thanks!' : 'Send'}
        </Button>
      </form>
    );
  }
}
