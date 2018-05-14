// @flow

import React, { Component } from 'react';
import { type RouterHistory } from 'react-router-dom';
import Head from 'react-helmet';

import HomeHeader from '../components/home-header';
import Input from '../components/input';

type Props = {
  history: RouterHistory,
};
type State = {
  code: string,
};

class LogInView extends Component<Props, State> {
  state = {
    code: '',
  };

  handleCodeChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ code: e.currentTarget.value });
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: check if it exists
    // TODO: save to cache
    this.props.history.push(`/c/${this.state.code}`);
  };

  render() {
    return (
      <div className="mh-100vh c-gray4 bgc-offwhite fs-16 fs-18-m">
        <Head>
          <title>Log In</title>
        </Head>
        <HomeHeader />
        <div className="pt-4 ph-3">
          Enter your secret code
          <form onSubmit={this.handleSubmit}>
            <Input type="text" onChange={this.handleCodeChange} />
          </form>
        </div>
      </div>
    );
  }
}

export default LogInView;
