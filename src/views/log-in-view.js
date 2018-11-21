// @flow

import React, { Component } from 'react';
import { type RouterHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import Head from 'react-helmet';

import AuthRedirect from '../components/auth-redirect';
import Button from '../components/button';
import HomeHeader from '../components/home-header';
import Input from '../components/input';
import {
  getCollectionSlug,
  setDefaultCollection,
} from '../store/reducers/navigation';

type Props = {
  history: RouterHistory,
  login: (slug: string) => void,
  collectionSlug?: string,
  match: {
    params: {
      collectionSlug?: string,
    },
  },
};
type State = {
  code: string,
};

class LogInView extends Component<Props, State> {
  state = {
    code: '',
  };

  componentDidMount() {
    const { match, login, collectionSlug: localStorageSlug } = this.props;
    const { collectionSlug: urlSlug } = match.params;

    // `urlSlug` is first to give the URL priority (to make it easier to change
    // between multiple collections.)
    if (urlSlug) {
      login(urlSlug);
      return;
    }

    if (localStorageSlug) {
      login(localStorageSlug);
      return;
    }
  }

  handleCodeChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ code: e.currentTarget.value });
  };

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const { login } = this.props;
    const { code: slug } = this.state;

    e.preventDefault();

    login(slug);
  };

  render() {
    const { history } = this.props;
    const { code } = this.state;

    const isSubmittable = code.length > 6;

    return (
      <div className="mh-100vh c-gray4 bgc-offwhite fs-16 fs-18-m">
        <Head>
          <title>Log In</title>
        </Head>
        <HomeHeader />
        <AuthRedirect redirect history={history} />
        <div className="pt-4 ph-3 mw-500 mh-auto ta-center">
          <div className="mb-4">
            <h3 className="fw-semibold mb-2">Enter your Poketo code</h3>
            <p>
              Your code is the last part of the link you got. <br />
              <code className="fs-14">
                poketo.app/c/
                <span className="bgc-extraFadedLightCoral br-4 pa-1">
                  {'<'}
                  your code
                  {'>'}
                </span>
              </code>
            </p>
          </div>
          <form onSubmit={this.handleSubmit}>
            <div className="mb-2">
              <Input type="text" onChange={this.handleCodeChange} />
            </div>
            <Button type="submit" variant="primary" disabled={!isSubmittable}>
              Go
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const collectionSlug = getCollectionSlug(state);
  return { collectionSlug };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    login(slug) {
      dispatch(setDefaultCollection(slug));
      ownProps.history.push('/feed');
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LogInView);
