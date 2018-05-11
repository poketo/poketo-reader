// @flow

import React, { Component } from 'react';
import axios from 'axios';

import Button from '../components/button';
import Input from '../components/input';

type Props = {};
type State = {
  status: 'idle' | 'submitting' | 'error' | 'success',
  email: string,
};

function postEmail(email: string): Promise<any> {
  return axios.post(
    'https://poketo-invite-muthjpqqoo.now.sh/v0/Invite%20Requests',
    {
      fields: { Email: email },
    },
  );
}

export default class HomeSubscribeForm extends Component<Props, State> {
  state = {
    status: 'idle',
    email: '',
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({ status: 'submitting' });

    postEmail(this.state.email)
      .then(res => {
        this.setState({ status: 'success' });
      })
      .catch(err => {
        this.setState({ status: 'error' });
      });
  };

  handleEmailChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value });
  };

  render() {
    const { email, status } = this.state;

    if (status === 'success') {
      return (
        <div className="ta-center">
          <span>Success!</span>
        </div>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="x">
          <Input
            className="bgc-white"
            placeholder="Enter your email..."
            type="email"
            value={email}
            onChange={this.handleEmailChange}
          />
          <div className="ml-2 w-33p">
            <Button type="submit" loading={status === 'submitting'}>
              Request invite
            </Button>
          </div>
        </div>
        {status === 'error' && (
          <div className="ta-center fs-14 mt-3">
            Something went wrong. Try again later.
          </div>
        )}
      </form>
    );
  }
}
